const express = require('express');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const Voter = require('./common/models/voters/voter');
const sendDataToSheet = require('./gsheets');
const sendDataToMeta = require('./meta');
const cors = require('cors');

dayjs.extend(customParseFormat);

const app = express();

const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:3080',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3080',
  'https://canivotenj.com',
  'https://www.canivotenj.com',
];
const envOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = envOrigins.length ? envOrigins : defaultOrigins;

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5002;

function parseDob(dobRaw) {
  if (!dobRaw || typeof dobRaw !== 'string') return null;
  const d = dayjs(dobRaw.trim(), ['MM/DD/YYYY', 'M/D/YYYY'], true);
  if (!d.isValid()) return null;
  return d.format('YYYY-MM-DD');
}

app.post('/find-voter', async (req, res) => {
  const { first_name, last_name, dob, email, phone_no, address, residence_zip } = req.body;

  const parsedData = {
    first_name: first_name?.toLowerCase().replace(/\s/g, ''),
    last_name: last_name?.toLowerCase().replace(/\s/g, ''),
  };

  const dobDate = parseDob(dob);
  if (!dobDate) {
    return res.status(400).json({ success: false, message: 'Invalid or missing date of birth (use MM/DD/YYYY).' });
  }

  try {
    const voter = await Voter.findOne({
      where: {
        first_name: parsedData.first_name,
        last_name: parsedData.last_name,
        dob: dobDate,
      },
      attributes: ['party', 'district'],
    });

    const is_reg = voter !== null;
    const party = voter?.party ?? null;
    const district = voter?.district ?? null;

    if (process.env.SHEETS_ENABLED === '1') {
      try {
        await sendDataToSheet(req.body, is_reg, { party, district });
      } catch (sheetErr) {
        console.error('Google Sheet append failed:', sheetErr.message);
      }
    }

    if (process.env.META_ENABLED === '1') {
      try {
        await sendDataToMeta(req.body);
      } catch (metaErr) {
        console.error('Meta send failed:', metaErr.message);
      }
    }

    if (is_reg) {
      return res.status(200).json({
        success: true,
        is_registered: true,
        party,
        district,
        message:
          'Registered voter on file. Party and district reflect the data available in this lookup file (U.S. House / Congressional district when present).',
      });
    }

    return res.status(404).json({
      success: true,
      is_registered: false,
      party: null,
      district: null,
    });
  } catch (error) {
    console.error('Error finding voter:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on PORT: ${PORT}`);
});

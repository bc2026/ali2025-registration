const { google } = require("googleapis");
const path = require("path");

function loadKeys() {
  const keysPath = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    ? path.resolve(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
    : path.join(__dirname, "secret_key.json");
  return require(keysPath);
}

const spreadsheetId =
  process.env.GOOGLE_SHEETS_SPREADSHEET_ID ||
  "1J73UDJsoyfLo8puxke4agKogcFnMLM9qsfyNyGwD0o0";

/** canivotenj.com lookups → Sheet2 (Sheet1 unchanged for legacy flow) */
const SHEET_RANGE = "Sheet2!A1:J10000";

async function sendDataToSheet(voter, is_reg, extra = {}) {
  const keys = loadKeys();
  const auth = new google.auth.GoogleAuth({
    credentials: keys,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const submission_time = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });

  const values = [
    [
      voter.first_name,
      voter.last_name,
      voter.email,
      voter.phone_no,
      voter.address,
      voter.residence_zip,
      is_reg,
      extra.party ?? "",
      extra.district ?? "",
      submission_time,
    ],
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: SHEET_RANGE,
    valueInputOption: "RAW",
    resource: { values },
  });

  console.log("Data sent successfully to Sheet2");
}

module.exports = sendDataToSheet;

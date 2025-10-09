const { google } = require("googleapis");
const keys = require("./secret_key.json");
const moment = require('moment'); // If not installed, run: npm install moment

async function sendDataToSheet(voter, is_reg) {
  const auth = new google.auth.GoogleAuth({
    credentials: keys,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1J73UDJsoyfLo8puxke4agKogcFnMLM9qsfyNyGwD0o0";
  const range = "Sheet1!A:G"

  // Get the current data to find the last row
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: range, // Ensure we're only checking columns A-G
  });

  const rows = response.data.values;
  const lastRow = rows ? rows.length + 1 : 2; // If there are rows, use the next one; else start from row 2

  // Use voter.submission_time from the client
  const submissionDate = voter.submission_time || ""; // fallback if not present

  // Values to send
  const values = [
    [
      voter.first_name, 
      voter.last_name, 
      voter.email, 
      voter.phone_no,  
      voter.address, 
      voter.residence_zip,
      is_reg,
      submissionDate // Use client time
    ]
  ];

  //console.log(values)
  // Update the last row dynamically within the A-G range
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `Sheet1!A${lastRow}:G${lastRow}`, // Ensure we only update columns A-G
    valueInputOption: "RAW",
    resource: { values }
  });

  console.log("Data sent successfully");
}

const handleSubmit = async () => {
  const submission_time = new Date().toISOString(); // or any preferred format
  const payload = {
    // ...other fields...
    submission_time,
  };
  await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
};

module.exports = sendDataToSheet;
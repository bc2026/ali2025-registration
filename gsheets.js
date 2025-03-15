const { google } = require("googleapis");
const keys = require("./secret_key.json");

async function sendDataToSheet(voter, is_reg) {
  const auth = new google.auth.GoogleAuth({
    credentials: keys,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1J73UDJsoyfLo8puxke4agKogcFnMLM9qsfyNyGwD0o0";
  const range = "Sheet1!A2:H1000";

  // Get the current data to find the last row
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!A:H", // Ensure we're only checking columns A-G
  });

  const rows = response.data.values;
  const lastRow = rows ? rows.length + 1 : 2; // If there are rows, use the next one; else start from row 2

  // Values to send
  const values = [
    [voter.first_name, 
     voter.last_name, 
     voter.email, 
     voter.phone_no,  
     voter.address, 
     voter.residence_city, 
     voter.residence_zip,
    is_reg]
  ];

//   console.log(values)
  // Update the last row dynamically within the A-G range
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `Sheet1!A${lastRow}:G${lastRow}`, // Ensure we only update columns A-G
    valueInputOption: "RAW",
    resource: { values }
  });

  console.log("Data sent successfully");
}

module.exports = sendDataToSheet;
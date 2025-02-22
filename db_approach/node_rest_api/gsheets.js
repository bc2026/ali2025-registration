const { google } = require("googleapis");
const keys = require("./secret_key.json");

async function sendDataToSheet() {
  const auth = new google.auth.GoogleAuth({
    credentials: keys,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1J73UDJsoyfLo8puxke4agKogcFnMLM9qsfyNyGwD0o0";
  const range = "Sheet1!A1:B2";

  const values = [
    ["Name", "Age"],
    ["Alice", 25],
    ["Bob", 30]
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    resource: { values }
  });

  console.log("Data sent successfully");
}

sendDataToSheet();

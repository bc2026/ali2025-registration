const { google } = require("googleapis");
const keys = require("./secret_key.json");

 async function sendDataToSheet(voter) {
  const auth = new google.auth.GoogleAuth({
    credentials: keys,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1J73UDJsoyfLo8puxke4agKogcFnMLM9qsfyNyGwD0o0";
  const range = "Sheet1!A2:G1000";

  const values = [
        [voter.first_name,
         voter.last_name,
         voter.email,
         voter.street_no,
         voter.street_name,
         voter.residence_city,
         voter.residence_zip]
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    resource: { values }
  });

  console.log("Data sent successfully");
}

module.exports = sendDataToSheet;

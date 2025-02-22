const express = require("express");
const { google } = require("googleapis");
const keys = require("./secret_key.json"); // Securely store this file

const app = express();
app.use(express.json()); // Enable JSON parsing

// Authenticate with Google Sheets API
async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: keys,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

async function updateGoogleSheets(values) {
  try {
    // const { values } = req.body; // Expecting an array of values from frontend
    const {values} = [1,2,3,4,5]
    const spreadsheetId = "1J73UDJsoyfLo8puxke4agKogcFnMLM9qsfyNyGwD0o0";
    const range = "Sheet1!A1:B2"; // Change to your desired range

    const sheets = await getSheetsClient();
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource: {values},
    });

    console.log({ message: "Data sent successfully!" });
  } catch (error) {
    console.log({ error: "Failed to update sheet" });
  }
}
  
updateGoogleSheets([1,2,3,4,5]);
const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public"))); // Serve frontend

// ✅ Ensure CSV file exists
const csvFilePath = path.join(__dirname, "data.csv");
if (!fs.existsSync(csvFilePath)) {
    fs.writeFileSync(csvFilePath, "Name,Last Name,Email,Address\n");
}

// ✅ API endpoint to save form data to CSV
app.post("/save", (req, res) => {
    const { name, lastname, email, address } = req.body;

    if (!name || !lastname || !email || !address) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const csvRow = `${name},${lastname},${email},${address}\n`;

    fs.appendFile(csvFilePath, csvRow, (err) => {
        if (err) {
            console.error("Error writing to CSV:", err);
            return res.status(500).json({ message: "Error saving data." });
        }
        res.json({ message: "Data saved successfully!" });
    });
});

// ✅ Redirect root URL to index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

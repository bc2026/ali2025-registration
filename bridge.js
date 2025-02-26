const express = require("express");
const app = express();
const fetch = require("node-fetch");

document.getElementById("userForm").addEventListener("submit", async function(event) {
    
});


app.use(express.json());
app.post("/7ab4c3a9ccce4f9675fc0803c26ba9bb", async (req, res) => {
    event.preventDefault();
    
    const formatted_dob = new Date(document.getElementById("dob").value);
    const formData = {
        first_name: document.getElementById("first_name").value.toLowerCase(),
        last_name: document.getElementById("last_name").value.toLowerCase(),
        dob: formatted_dob,
        email: document.getElementById("email").value,
        phone_no: document.getElementById("phone_no").value,
        address: document.getElementById("address").value.toLowerCase(),
        residence_city: document.getElementById("residence_city").value.toLowerCase(),
        residence_zip: document.getElementById("residence_zip").value,
        state: document.getElementById("state").value
    };
    
    if (formData.state !== "NJ") {   
        alert("You must be a resident of New Jersey to vote.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/find-voter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


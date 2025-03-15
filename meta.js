const express = require('express');
const trackEventRoute = require('./trackEventRoute');
const app = express(); // Initialize Express FIRST

app.use(express.json());
app.use(trackEventRoute);

async function sendDataToMeta(voter) {
fetch('http://localhost:3000/track-event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'  // Tell the server we're sending JSON data
    },
    body: JSON.stringify({
      // Here, you specify the data you want to send to the server
      emails: [voter.email],
      phones: [voter.phone_no]
    })
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch((error) => console.error('Error:', error));
}
  
module.exports = sendDataToSheet;
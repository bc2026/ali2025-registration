const express = require('express');
const app = express(); // Initialize Express FIRST
app.use(express.json());

const trackEventRoute = require('./trackEventRoute');
app.use(trackEventRoute);

async function sendDataToMeta(voter) {

console.log(voter);

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
  
module.exports = sendDataToMeta;
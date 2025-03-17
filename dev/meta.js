const express = require('express');
const app = express(); // Initialize Express FIRST
app.use(express.json());

const bizSdk = require('facebook-nodejs-business-sdk');
const Content = bizSdk.Content;
const CustomData = bizSdk.CustomData;
const DeliveryCategory = bizSdk.DeliveryCategory;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const ServerEvent = bizSdk.ServerEvent;

async function sendDataToMeta(app, voter) {

const access_token = 'EAAHfWfXi0PYBOyZA7l4rXFypXwJPoVMfaqXcntwEDVVZACBoEHObOWNfOMoF922OILdWeBs1gk9ZAJq7GLWngR2ZB9YPZBRppwOUOQKmjoqsthQW32xD0E2oQq683Qg8lyfMKiegZCcnAESzTsfHsK6VdX1FXagQ5J3Vi3cgIk5XZC49bsThFw3op8BzKFoBLeIqtrp3EHquzQZBqn73MxHgit4oCYZBFYfsbt1TU9nlpwLgZD';
const pixel_id = '312046999514384';
const api = bizSdk.FacebookAdsApi.init(access_token);

app.post('/track-event', (req, res) => {
    const userData = (new UserData())
                    .setEmails([voter.email])
                    .setPhones([voter.phone_no])
                    .setClientIpAddress(req.connection.remoteAddress)  // Using the IP address from the request
                    .setClientUserAgent(req.headers['user-agent'])  // Using the user agent from the request
                    .setFbp('fb.1.1558571054389.1098115397')
                    .setFbc('fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890');

    const serverEvent = (new ServerEvent())
                    .setEventName('submit_form')
                    .setEventTime(current_timestamp)
                    .setUserData(userData)
                    .setEventSourceUrl('http://jcvotes.eastus2.cloudapp.azure.com:3000/')
                    .setActionSource('website');

    const eventsData = [serverEvent];
    const eventRequest = (new EventRequest(access_token, pixel_id))
                    .setEvents(eventsData);

    eventRequest.execute().then(
        response => {
            console.log('Response: ', response);
            res.status(200).send('Event tracked successfully');
        },
        err => {
            console.error('Error: ', err);
            res.status(500).send('Error tracking event');
        }
    );
});
}
  
module.exports = sendDataToMeta;
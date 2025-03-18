const bizSdk = require('facebook-nodejs-business-sdk');

const UserData = bizSdk.UserData;
const ServerEvent = bizSdk.ServerEvent;
const EventRequest = bizSdk.EventRequest;

const ACCESS_TOKEN = 'EAAIhgFqHne0BO8esBgr6qltmEEXZAqjQoEFAFAVSZAGRZCOcBa6Y0LvHrgJacFtKfgy4XbtDxG0jtEYzmAaKMI5nDMZApG5mQXiLqwKdAFWD7tZBh2kgDJrcPLppZCJjizOw1Kezz79H3mfo0e7kTTftlEyU1RDNqoZBg3GMBekfTxelqPAiYpJRReENEIuBvpNAwZDZD';
const PIXEL_ID = '312046999514384';


async function sendDataToMeta(voter) {
    try {
        console.log("Inside sendDataToMeta, preparing event...");
        console.log("Voter data: ", JSON.stringify(voter));
        console.log(JSON.stringify({
          email:          voter.email,
          phone:          voter.phone_no,
          first_name:     voter.first_name,
          last_name:      voter.last_name,
          zip:            voter.residence_zip}))
        const userData = new UserData({
          email:          voter.email,
          phone:          voter.phone_no,
          first_name:     voter.first_name,
          last_name:      voter.last_name,
          zip:            voter.residence_zip})
          .setFbp('fb.1.1558571054389.1098115397')
          .setFbc('fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890');

        const serverEvent = new ServerEvent()
            .setEventName('submit_form')
            .setEventTime(Math.floor(Date.now() / 1000)) // Current timestamp
            .setUserData(userData)
            .setEventSourceUrl('http://jcvotes.eastus2.cloudapp.azure.com:3001/')
            .setActionSource('website');

        const eventsData = [serverEvent];
        const eventRequest = new EventRequest(ACCESS_TOKEN, PIXEL_ID).setEvents(eventsData);

        console.log("Sending event to Meta...");
        const response = await eventRequest.execute();
        console.log('Meta API Response:', response);

        return response;
    } catch (error) {
        console.error('Error sending data to Meta:', error);
        throw error; // Rethrow for error handling in `server.js`
    }
}

module.exports = sendDataToMeta;

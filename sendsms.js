const accountSid = process.env.Sid
const authToken = process.env.Token;
const client = require('twilio')(accountSid, authToken);

client.messages.create({
        body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
        from: '+15183189592',
        to: '+919472643974'
        })
        .then(message => console.log(message.sid))
        .catch(err=>console.log(err));
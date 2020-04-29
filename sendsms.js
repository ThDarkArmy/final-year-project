const accountSid = 'AC8f3487a8d5091539653fa6fdf28696d8';
const authToken = 'b110fbfe4794f24784e3a411af0b065b';
const client = require('twilio')(accountSid, authToken);

client.messages.create({
        body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
        from: '+15183189592',
        to: '+919472643974'
        })
        .then(message => console.log(message.sid))
        .catch(err=>console.log(err));
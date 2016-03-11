'use strict';

const config = require('./config/config.json');
const mailer = require('./services/mailer.js').create({ sender: config.email.from, auth: config.email.auth });

mailer.mail({
  recipients: 'paulin.trognon@gmail.com', // An array if you have multiple recipients.
  subject: 'Hey you, awesome!',
  text: 'Mailgun rocks, pow pow!',
})
  .then((res) => console.log(res));

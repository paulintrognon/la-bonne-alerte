"use strict";

const config = require("./config/config.json"),
  mailer = require("./services/mailer.js").create({sender: config.email.from, auth: config.email.auth});

mailer.mail({
  recipients: "paulin.trognon@gmail.com", // An array if you have multiple recipients.
  subject: "Hey you, awesome!",
  text: "Mailgun rocks, pow pow!"
})
  .then(function (res) {
    console.log(res);
  });

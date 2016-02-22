"use strict";

const config = require("./config/config.json"),
  nodemailer = require("nodemailer"),
  mg = require("nodemailer-mailgun-transport");

const nodemailerMailgun = nodemailer.createTransport(mg({
  auth: config.email.auth
}));

nodemailerMailgun.sendMail({
  from: config.email.from,
  to: "paulin.trognon@gmail.com", // An array if you have multiple recipients.
  subject: "Hey you, awesome!",
  text: "Mailgun rocks, pow pow!"
}, function (err, info) {
  if (err) {
    console.log("Error: " + err);
  }
  else {
    console.log("Response: " + JSON.stringify(info));
  }
});

nodemailerMailgun.close();

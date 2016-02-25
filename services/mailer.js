"use strict";

module.exports = {
  create
};

const BPromise = require("bluebird"),
  nodemailer = require("nodemailer"),
  mailgun = {
    generateConfig: require("nodemailer-mailgun-transport")
  };

function create(specs) {
  const that = {},
    sender = specs.sender,
    transporter = nodemailer.createTransport(mailgun.generateConfig({
      auth: specs.auth
    }));

  that.mail = mail;

  return that;

  ////////////////////////////////////////////////////////////

  function mail(parameters) {
    const mailOptions = {
      from: sender,
      to: parameters.recipients,
      subject: parameters.subject,
      text: parameters.text,
      html: parameters.html
    };

    return new BPromise(function (resolve, reject) {
      transporter.sendMail(mailOptions, function(error, info) {
        if(error) {
          return reject(error);
        }
        resolve(info);
      });
    });
  }
}

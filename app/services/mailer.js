'use strict';

module.exports = {
  create,
};

const BPromise = require('bluebird');
const nodemailer = require('nodemailer');
const generateMailGunConfig = require('nodemailer-mailgun-transport');

function create(specs) {
  const that = {};
  const sender = specs.sender;
  const transporter = nodemailer.createTransport(generateMailGunConfig({
    auth: specs.auth,
  }));

  that.mail = mail;

  return that;

  //----------------------------------------------------------

  function mail(parameters) {
    const mailOptions = {
      from: sender,
      to: parameters.recipients,
      subject: parameters.subject,
      text: parameters.text,
      html: parameters.html,
    };

    return new BPromise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(info);
      });
    });
  }
}

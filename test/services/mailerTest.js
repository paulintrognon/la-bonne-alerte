"use strict";

describe("mailerService", function () {
  it("should create a mailgun transport", mailgunTransportTest);
  describe(".mail", mailSuite);
});

const proxyquire = require("proxyquire"),
  should = require("should/as-function"),
  sinon = require("sinon"),
  nodemailer = {},
  mailgunConfigStub = sinon.stub(),
  serviceFactory = proxyquire("../../services/mailer.js", {
    nodemailer,
    "nodemailer-mailgun-transport": mailgunConfigStub
  });

const sender = "super-sender",
  auth = {
    api_key: "super-key",
    domain: "super-domain"
  };

function mailgunTransportTest() {
  nodemailer.createTransport = sinon.stub().returns("generated-transport");
  mailgunConfigStub.returns("generated-mailgun-config");

  serviceFactory.create({auth, sender});

  should(mailgunConfigStub.callCount).equal(1);
  should(mailgunConfigStub.firstCall.args[0]).have.property("auth", auth);
  should(nodemailer.createTransport.callCount).equal(1);
  should(nodemailer.createTransport.firstCall.args[0]).equal("generated-mailgun-config");
}

function mailSuite() {
  it("should call transporter.sendMail and wrap in promise", mailgunTransportTest);

  function mailgunTransportTest(done) {
    const sendMailStub = stubNodeMailer();

    const service = serviceFactory.create({auth, sender}),
      params = {
        recipients: "super-recipients",
        subject: "super-subject",
        text: "super-text",
        html: "super-html"
      };

    service.mail(params)
      .then(function (res) {
        should(sendMailStub.callCount).equal(1);
        should(sendMailStub.firstCall.args[0]).eql({
          from: sender,
          html: params.html,
          subject: params.subject,
          text: params.text,
          to: params.recipients
        });
        should(res).equal("send-mail-info");
      })
      .then(done, done);
  }
}

function stubNodeMailer() {
  const transport = {
    sendMail: () => undefined
  };

  const sendMailStub = sinon.stub(transport, "sendMail", (options, callback) => callback(null, "send-mail-info"));
  nodemailer.createTransport = sinon.stub().returns(transport);

  return sendMailStub;
}

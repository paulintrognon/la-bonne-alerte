"use strict";

describe("mailerService", function () {
  it("should create a mailgun transport", mailgunTransportTest);
  describe(".mail", mailSuite);

  afterEach(restore);
});

const _ = require("lodash"),
  rewire = require("rewire"),
  should = require("should/as-function"),
  sinon = require("sinon"),
  stubs = {};

const sender = "super-sender",
  auth = {
    api_key: "super-key",
    domain: "super-domain"
  };

function mailgunTransportTest() {
  createService();

  should(stubs.generateConfig.callCount).equal(1);
  should(stubs.generateConfig.firstCall.args[0]).have.property("auth", auth);
  should(stubs.nodemailerTransportFactory.callCount).equal(1);
  should(stubs.nodemailerTransportFactory.firstCall.args[0]).equal("generated-mailgun-config");
}

function mailSuite() {
  it("should call transporter.sendMail and wrap in promise", mailgunTransportTest);

  function mailgunTransportTest(done) {
    const service = createService(),
      params = {
        recipients: "super-recipients",
        subject: "super-subject",
        text: "super-text",
        html: "super-html"
      };

    service.mail(params)
      .then(function (res) {
        should(stubs.sendMail.callCount).equal(1);
        should(stubs.sendMail.firstCall.args[0]).eql({
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

function createService() {
  var serviceFactory = rewire("../../services/mailer.js"),
    nodemailer = serviceFactory.__get__("nodemailer"),
    mailgun = serviceFactory.__get__("mailgun"),
    service;

  var transport = {
    sendMail: () => undefined
  };

  stubs.sendMail = sinon.stub(transport, "sendMail", (options, callback) => callback(null, "send-mail-info"));
  stubs.nodemailerTransportFactory = sinon.stub(nodemailer, "createTransport").returns(transport);

  stubs.generateConfig = sinon.stub(mailgun, "generateConfig").returns("generated-mailgun-config");

  service = serviceFactory.create({sender, auth});

  return service;
}

function restore() {
  _.forOwn(stubs, (stub) => stub.restore());
}

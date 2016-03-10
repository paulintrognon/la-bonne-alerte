"use strict";

describe("template service", function templateServiceSuite() {
  describe("render", renderSuite);
});

const BPromise = require("bluebird"),
  proxyquire = require("proxyquire"),
  should = require("should/as-function"),
  sinon = require("sinon");

const fs = {},
  handlebars = {},
  serviceFactory = proxyquire("../../services/template.js", {
    fs,
    handlebars
  });

function renderSuite() {
  it("should render template using given data", templateTest);
  it("should read file only once when calling multiple times", multipleCallTest);

  function templateTest(done) {
    const service = serviceFactory.create(),
      firstname = "Jack",
      lastname = "Aubrey",
      data = {firstname, lastname},
      fileContent = "hello {{firstname}} {{lastname}}!",
      expectedRes = `hello ${firstname} ${lastname}!`,
      path = "super-path";

    fs.readFileAsync = sinon.stub().returns(BPromise.resolve(fileContent));

    service.render(path, data)
      .then(function (res) {
        should(res).eql(expectedRes);
      })
      .then(done, done);
  }

  function multipleCallTest(done) {
    const service = serviceFactory.create(),
      data1 = "suer-data-1",
      data2 = "suer-data-2",
      path = "super-path",
      expectedRes1 = "super-res-1",
      expectedRes2 = "super-res-2",
      fileContent = "super-content",
      templateStub = sinon.stub();


    fs.readFileAsync = sinon.stub().returns(BPromise.resolve(fileContent));
    handlebars.compile = sinon.stub().returns(templateStub);
    templateStub.withArgs(data1).returns(expectedRes1);
    templateStub.withArgs(data2).returns(expectedRes2);

    BPromise.props({
      firstCall: service.render(path, data1),
      secondCall: service.render(path, data2)
    })
      .then(function (res) {
        return service.render(path, data1)
          .then(function (thirdCallRes) {
            res.thirdCall = thirdCallRes;
            return res;
          });
      })
      .then(function (res) {
        should(fs.readFileAsync.callCount).equal(1);
        should(fs.readFileAsync.firstCall.args[0]).endWith("/../templates/" + path);
        should(handlebars.compile.callCount).equal(1);
        should(handlebars.compile.firstCall.args[0]).equal(fileContent);
        should(templateStub.callCount).equal(3);
        should(templateStub.firstCall.args[0]).equal(data1);
        should(templateStub.secondCall.args[0]).equal(data2);
        should(templateStub.thirdCall.args[0]).equal(data1);
        should(res.firstCall).equal(expectedRes1);
        should(res.secondCall).equal(expectedRes2);
        should(res.thirdCall).equal(expectedRes1);
      })
      .then(done, done);
  }
}

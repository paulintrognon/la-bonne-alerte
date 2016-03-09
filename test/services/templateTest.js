"use strict";

describe("template service", function templateServiceSuite() {
  describe("render", renderSuite);

  afterEach(restore);
});

const _ = require("lodash"),
  BPromise = require("bluebird"),
  rewire = require("rewire"),
  should = require("should/as-function"),
  sinon = require("sinon");

const serviceFactory = rewire("../../services/template.js"),
  fs = serviceFactory.__get__("fs"),
  handlebars = serviceFactory.__get__("handlebars"),
  stubs = {};

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

    stubs.readFile = sinon.stub(fs, "readFileAsync").returns(BPromise.resolve(fileContent));

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


    stubs.readFile = sinon.stub(fs, "readFileAsync").returns(BPromise.resolve(fileContent));
    stubs.compile = sinon.stub(handlebars, "compile").returns(templateStub);
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
        should(stubs.readFile.callCount).equal(1);
        should(stubs.readFile.firstCall.args[0]).endWith("/../templates/" + path);
        should(stubs.compile.callCount).equal(1);
        should(stubs.compile.firstCall.args[0]).equal(fileContent);
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

function restore() {
  _.forOwn(stubs, (stub) => stub.restore());
}

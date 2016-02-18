"use strict";

describe("watcher service", function () {
  it("should watch an url using leboncoinService", test);
});

const BPromise = require("bluebird"),
  should = require("should/as-function"),
  sinon = require("sinon"),
  rewire = require("rewire");

function test(done) {
  const serviceFactory = rewire("../../services/watcher.js"),
    callback = sinon.stub(),
    getItemsStub = sinon.stub(),
    fakeLeboncoin = {
      getItems: getItemsStub
    },
    parameters = {
      delay: (1/60/2),
      callback,
      url: "super.url.com"
    },
    firstItems = [{id: 1}],
    secondItems = [{id: 1}, {id: 2}],
    thirdItems = [{id: 2}, {id: 3}];

  serviceFactory.__set__("leboncoinFactory", {create: () => fakeLeboncoin});

  getItemsStub.onFirstCall().returns(BPromise.resolve(firstItems));
  getItemsStub.onSecondCall().returns(BPromise.resolve(secondItems));
  getItemsStub.onThirdCall().returns(BPromise.resolve(thirdItems));
  getItemsStub.returns(BPromise.resolve([]));

  const service = serviceFactory.create();

  service.watch(parameters);

  setTimeout(function () {
    should(getItemsStub.callCount).equal(3);
    should(getItemsStub.firstCall.args[0]).equal(parameters.url);
    should(getItemsStub.secondCall.args[0]).equal(parameters.url);
    should(getItemsStub.thirdCall.args[0]).equal(parameters.url);
    should(callback.callCount).equal(2);
    should(callback.firstCall.args[0]).eql([{id: 2}]);
    should(callback.secondCall.args[0]).eql([{id: 3}]);
    done();
  }, 1200);
}

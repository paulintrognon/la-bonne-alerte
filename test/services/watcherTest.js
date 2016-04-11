'use strict';

describe('watcher service', () => {
  it('should watch an url using leboncoinService', startTest);
  it('should not watch twice', startTwiceTest);
  it('should stop when asked', stopTest);
});

const BPromise = require('bluebird');
const fakeLoggerFactory = require('../fakeLogger.js');
const should = require('should/as-function');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

function startTest(done) {
  const getItemsStub = sinon.stub();
  const callback = sinon.stub();
  const parameters = {
    delay: (1 / 60 / 2),
    callback,
    url: 'super.url.com',
  };
  const firstItems = [{ id: 1 }];
  const secondItems = [{ id: 1 }, { id: 2 }];
  const thirdItems = [{ id: 2 }, { id: 3 }];

  getItemsStub.onFirstCall().returns(BPromise.resolve(firstItems));
  getItemsStub.onSecondCall().returns(BPromise.resolve(secondItems));
  getItemsStub.onThirdCall().returns(BPromise.resolve(thirdItems));
  getItemsStub.returns(BPromise.resolve([]));

  const service = createService(parameters, getItemsStub);

  service.start();

  setTimeout(() => {
    should(getItemsStub.callCount).equal(3);
    should(getItemsStub.firstCall.args[0]).equal(parameters.url);
    should(getItemsStub.secondCall.args[0]).equal(parameters.url);
    should(getItemsStub.thirdCall.args[0]).equal(parameters.url);
    should(callback.callCount).equal(2);
    should(callback.firstCall.args[0]).eql([{ id: 2 }]);
    should(callback.secondCall.args[0]).eql([{ id: 3 }]);
    service.stop();
    done();
  }, 1200);
}

function startTwiceTest(done) {
  const logger = fakeLoggerFactory.create();
  const getItemsStub = sinon.stub().returns(BPromise.resolve([]));
  const callback = sinon.stub();
  const parameters = {
    delay: (1 / 60 / 2),
    callback,
  };

  const service = createService(parameters, getItemsStub, logger);

  BPromise.all([
    service.start(),
    service.start(),
    service.start(),
  ])
    .then(service.stop)
    .then(() => {
      should(getItemsStub.callCount).equal(1);
      should(callback.callCount).equal(0);
      should(logger.warn.callCount).equal(2);
      should(logger.warn.firstCall.args[0]).equal('Watcher is already watching.');
      should(logger.warn.secondCall.args[0]).equal('Watcher is already watching.');
    })
    .then(done, done);
}

function stopTest(done) {
  const getItemsStub = sinon.stub().returns(BPromise.resolve([]));
  const callback = sinon.stub();
  const parameters = {
    delay: (1 / 60 / 2),
    callback,
  };

  const service = createService(parameters, getItemsStub);

  service.start();
  service.stop();

  setTimeout(() => {
    should(getItemsStub.callCount).equal(1);
    should(callback.callCount).equal(0);
    done();
  }, 1200);
}

function createService(parameters, getItemsStub, fakeLogger) {
  const fakeLeboncoin = {
    getItems: getItemsStub,
  };
  const serviceFactory = proxyquire('../../services/watcher.js', {
    './leboncoin.js': { create: () => fakeLeboncoin },
    './logger.js': fakeLogger || fakeLoggerFactory.create(),
  });
  return serviceFactory.create(parameters);
}

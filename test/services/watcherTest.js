'use strict';

describe('watcher service', () => {
  it('should watch an url using leboncoinService', startTest);
  it('should not watch twice', startTwiceTest);
  it('should stop when asked', stopTest);
  it('should warn if trying to stop a non-started watcher', stopNonStartedTest);
});

const BPromise = require('bluebird');
const fakeLoggerFactory = require('../fakeLogger.js');
const should = require('should/as-function');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

function startTest(done) {
  const getItemsStub = sinon.stub();
  const callback = sinon.stub();
  const scheduleJobStub = sinon.spy((rule, cb) => {
    cb()
      .then(cb)
      .then(cb);
    return createFakeJob();
  });
  const parameters = {
    callback,
    rule: 'super-rule',
    url: 'super.url.com',
  };
  const firstItems = [{ id: 1 }];
  const secondItems = [{ id: 1 }, { id: 2 }];
  const thirdItems = [{ id: 2 }, { id: 3 }];

  getItemsStub.onFirstCall().returns(BPromise.resolve(firstItems));
  getItemsStub.onSecondCall().returns(BPromise.resolve(secondItems));
  getItemsStub.onThirdCall().returns(BPromise.resolve(thirdItems));
  getItemsStub.returns(BPromise.resolve([]));

  const service = createService({ parameters, getItemsStub, scheduleJobStub });

  service.start();

  setTimeout(() => {
    should(getItemsStub.callCount).equal(4);
    should(getItemsStub.firstCall.args[0]).equal(parameters.url);
    should(getItemsStub.secondCall.args[0]).equal(parameters.url);
    should(getItemsStub.thirdCall.args[0]).equal(parameters.url);
    should(callback.callCount).equal(2);
    should(callback.firstCall.args[0]).eql([{ id: 2 }]);
    should(callback.secondCall.args[0]).eql([{ id: 3 }]);
    should(scheduleJobStub.callCount).equal(1);
    should(scheduleJobStub.firstCall.args[0]).equal(parameters.rule);
    service.stop();
    done();
  }, 500);
}

function startTwiceTest(done) {
  const logger = fakeLoggerFactory.create();
  const getItemsStub = sinon.stub().returns(BPromise.resolve([]));
  const scheduleJobStub = sinon.stub().returns(createFakeJob());
  const callback = sinon.stub();
  const parameters = {
    callback,
  };

  const service = createService({ parameters, getItemsStub, scheduleJobStub, logger });

  BPromise.all([
    service.start(),
    service.start(),
    service.start(),
  ])
    .then(service.stop)
    .then(() => {
      should(scheduleJobStub.callCount).equal(1);
      should(getItemsStub.callCount).equal(1);
      should(logger.warn.callCount).equal(2);
      should(logger.warn.firstCall.args[0]).equal('Watcher is already watching.');
      should(logger.warn.secondCall.args[0]).equal('Watcher is already watching.');
    })
    .then(done, done);
}

function stopTest(done) {
  const getItemsStub = sinon.stub().returns(BPromise.resolve([]));
  const cancelJobStub = sinon.stub();
  const scheduleJobStub = sinon.stub().returns(createFakeJob(cancelJobStub));
  const callback = sinon.stub();
  const parameters = {
    callback,
  };

  const service = createService({ parameters, getItemsStub, scheduleJobStub });

  service.start();
  service.stop()
    .then(() => {
      should(getItemsStub.callCount).equal(1);
      should(callback.callCount).equal(0);
      should(cancelJobStub.callCount).equal(1);
    })
    .then(done, done);
}

function stopNonStartedTest() {
  const logger = fakeLoggerFactory.create();

  const service = createService({ logger });
  service.stop();

  should(logger.warn.callCount).equal(1);
  should(logger.warn.firstCall.args[0]).equal('Watcher is not watching.');
}

function createService(parameters) {
  const fakeLeboncoin = {
    getItems: parameters.getItemsStub || sinon.stub(),
  };
  const serviceFactory = proxyquire('../../services/watcher.js', {
    'node-schedule': createFakeSchedule(parameters.scheduleJobStub),
    './leboncoin.js': { create: () => fakeLeboncoin },
    './logger.js': parameters.logger || fakeLoggerFactory.create(),
  });
  return serviceFactory.create(parameters.parameters || {});
}

function createFakeSchedule(scheduleJob) {
  return {
    scheduleJob: scheduleJob || sinon.stub().returns(createFakeJob()),
  };
}

function createFakeJob(cancelStub) {
  return {
    cancel: cancelStub || sinon.stub(),
  };
}

'use strict';

describe('crawler service', () => {
  describe('.clickOn', clickOnSuite);
  describe('.execute', executeSuite);
  describe('.scrollToMaxHeight', scrollToMaxHeightSuite);
});

function clickOnSuite() {
  it('should click and wait', clickAndWaitTest);
  it('should not click if element does not exist', clickNotExistTest);
}

function executeSuite() {
  it('should execute then resolve result', executeTest);
  it('should execute then reject if error', executeErrorTest);
}

function scrollToMaxHeightSuite() {
  it('should scroll', scrollTest);
}

const BPromise = require('bluebird');
const path = '../../app/services/crawler.js';
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const should = require('should');

// -----------------------------------------------------------

function clickAndWaitTest(done) {
  const nightmare = createFakeNightmare({});
  const clickSelector = 'click-selector';
  const waitSelector = 'wait-selector';
  const url = 'super-url';
  nightmare.exists.returns(BPromise.resolve(true));
  const service = createService({ url, nightmare });

  service.clickOn(clickSelector, waitSelector)
    .then(() => {
      should(nightmare.exists.callCount).equal(1);
      should(nightmare.exists.firstCall.args[0]).equal(clickSelector);
      should(nightmare.click.callCount).equal(1);
      should(nightmare.click.firstCall.args[0]).equal(clickSelector);
      should(nightmare.wait.callCount).equal(1);
      should(nightmare.wait.firstCall.args[0]).equal(waitSelector);
    })
    .then(done, done);
}

function clickNotExistTest(done) {
  const nightmare = createFakeNightmare({});
  const clickSelector = 'click-selector';
  const url = 'super-url';
  nightmare.exists.returns(BPromise.resolve(false));
  const service = createService({ url, nightmare });

  service.clickOn(clickSelector)
    .then(() => {
      should(nightmare.exists.callCount).equal(1);
      should(nightmare.exists.firstCall.args[0]).equal(clickSelector);
      should(nightmare.click.callCount).equal(0);
      should(nightmare.wait.callCount).equal(0);
    })
    .then(done, done);
}

// -----------------------------------------------------------

function executeTest(done) {
  const expectedResult = [];
  const nightmare = createFakeNightmare({ res: expectedResult });
  const service = createService({ nightmare });
  const callback = sinon.stub();

  service.execute(callback)
    .then(res => {
      should(callback.callCount).equal(1);
      should(res).equal(expectedResult);
    })
    .then(done, done);
}

function executeErrorTest(done) {
  const error = { message: 'oh noes!' };
  const nightmare = createFakeNightmare({ err: error });
  const service = createService({ nightmare });
  const callback = sinon.stub();

  service.execute(callback)
    .then(() => {
      throw new Error('should have rejected');
    }, err => {
      should(err).equal(error);
    })
    .then(done, done);
}

// -----------------------------------------------------------

function scrollTest() {
  const callback = sinon.stub();
  const nightmare = createFakeNightmare({ callback });
  const service = createService({ nightmare });

  service.scrollToMaxHeight();

  should(nightmare.evaluate.callCount).equal(6);
  should(nightmare.wait.callCount).equal(6);
  should(callback.callCount).equal(6);
  should(callback.firstCall.args[0]).equal(0);
  should(callback.secondCall.args[0]).equal(1000);
  should(callback.thirdCall.args[0]).equal(2000);
}

// -----------------------------------------------------------

function createService(specs) {
  const factory = proxyquire(path, {
    nightmare: () => specs.nightmare,
  });
  return factory(specs.url);
}

function createFakeNightmare(specs) {
  const fakeNightmare = {};
  fakeNightmare.goto = sinon.stub().returns(fakeNightmare);
  fakeNightmare.run = sinon.spy(callback => {
    callback(specs.err, specs.res);
    return fakeNightmare;
  });
  fakeNightmare.evaluate = sinon.spy((callback, arg1) => {
    if (arg1 !== undefined) {
      specs.callback(arg1);
    } else {
      callback();
    }
    return fakeNightmare;
  });
  fakeNightmare.wait = sinon.stub().returns(fakeNightmare);
  fakeNightmare.exists = sinon.stub().returns(BPromise.resolve());
  fakeNightmare.end = sinon.stub().returns(fakeNightmare);
  fakeNightmare.click = sinon.stub().returns(fakeNightmare);
  return fakeNightmare;
}

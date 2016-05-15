'use strict';

describe('crawler service', () => {
  describe('.crawl', crawlSuite);
  describe('.crawlWithScroll', crawlWithScrollSuite);
});

function crawlSuite() {
  it('should go to given url then execute callback', crawlTest);
  it('should reject if error while crawling', crawlErrTest);
}

function crawlWithScrollSuite() {
  it('should scroll to 5000 px', crawlWithScrollTest);
}

const path = '../../app/services/crawler.js';
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const should = require('should');

// -----------------------------------------------------------

function crawlTest(done) {
  const expectedResult = [];
  const nightmare = createFakeNightmare({ res: expectedResult });
  const service = createService({ nightmare });
  const url = 'super-url';
  const callback = sinon.stub();

  service.crawl(url, callback)
    .then(res => {
      should(nightmare.goto.callCount).equal(1);
      should(nightmare.goto.firstCall.args[0]).equal(url);
      should(nightmare.evaluate.callCount).equal(1);
      should(nightmare.evaluate.firstCall.args[0]).equal(callback);
      should(nightmare.run.callCount).equal(1);
      should(nightmare.end.callCount).equal(1);
      should(res).equal(expectedResult);
    })
    .then(done, done);
}

function crawlErrTest(done) {
  const error = { message: 'oh noes!' };
  const nightmare = createFakeNightmare({ err: error });
  const service = createService({ nightmare });
  const callback = sinon.stub();

  service.crawl('url', callback)
    .then(() => {
      throw new Error('should have rejected');
    }, err => {
      should(err).equal(error);
    })
    .then(done, done);
}

function createService(specs) {
  return proxyquire(path, {
    nightmare: () => specs.nightmare,
  });
}

// -----------------------------------------------------------

function crawlWithScrollTest(done) {
  const expectedResult = [];
  const scrollCallback = sinon.stub();
  const nightmare = createFakeNightmare({ res: expectedResult, callback: scrollCallback });
  const service = createService({ nightmare });
  const url = 'super-url';
  const callback = sinon.stub();

  service.crawlWithScroll(url, callback)
    .then(res => {
      should(nightmare.goto.callCount).equal(1);
      should(nightmare.goto.firstCall.args[0]).equal(url);
      should(nightmare.evaluate.callCount).equal(7);
      should(scrollCallback.callCount).equal(6);
      should(scrollCallback.firstCall.args[0]).equal(0);
      should(scrollCallback.secondCall.args[0]).equal(1000);
      should(scrollCallback.thirdCall.args[0]).equal(2000);
      should(nightmare.wait.callCount).equal(6);
      should(callback.callCount).equal(1);
      should(nightmare.run.callCount).equal(1);
      should(nightmare.end.callCount).equal(1);
      should(res).equal(expectedResult);
    })
    .then(done, done);
}

// -----------------------------------------------------------

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
  fakeNightmare.end = sinon.stub().returns(fakeNightmare);
  return fakeNightmare;
}

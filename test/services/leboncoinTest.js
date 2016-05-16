'use strict';

describe('leboncoin service', () => {
  describe('.getItems', getItemsSuite);
  describe('.completeItems', completeItemsSuite);
});

function getItemsSuite() {
  it('should call getItems service then add ids', getItemsTest);
}

function completeItemsSuite() {
  it('should return an empty array if items is empty', emptyItemsTest);
  it('should call getItem per item given', completeItemsTest);
}

const BPromise = require('bluebird');
const path = '../../app/services/leboncoin.js';
const proxyquire = require('proxyquire');
const should = require('should');
const sinon = require('sinon');

// -----------------------------------------------------------

function getItemsTest(done) {
  const items = [
    { foo: 'bar', href: 'http://foo.bar/foobar' },
    { fiz: 'biz', href: 'http://fiz.biz/fizbiz' },
  ];
  const url = 'super-url';
  const getItemsStub = sinon.stub().returns(BPromise.resolve(items));
  const service = createService({ getItemsStub });

  service.getItems(url)
    .then(res => {
      should(getItemsStub.callCount).equal(1);
      should(res).eql([
        {
          foo: 'bar',
          href: 'http://foo.bar/foobar',
          id: '1b959060f0bdf53b36a5bc1350f3bc26',
        },
        {
          fiz: 'biz',
          href: 'http://fiz.biz/fizbiz',
          id: '50d8094e37682d3b18b413d8a4bd666f',
        },
      ]);
    })
    .then(done, done);
}

// -----------------------------------------------------------

function emptyItemsTest(done) {
  const getItemStub = sinon.stub();
  const service = createService({ getItemStub });

  service.completeItems([])
    .then(res => {
      should(getItemStub.callCount).equal(0);
      should(res).eql([]);
    })
    .then(done, done);
}

function completeItemsTest(done) {
  const getItemStub = sinon.stub();
  const firstItem = { foo: 'first-item' };
  const secondItem = { foo: 'second-item' };
  const items = [
    { id: 1 },
    { id: 2 },
  ];

  getItemStub.onFirstCall().returns(BPromise.resolve(firstItem));
  getItemStub.onSecondCall().returns(BPromise.resolve(secondItem));

  const service = createService({ getItemStub });

  service.completeItems(items)
    .then(res => {
      should(getItemStub.callCount).equal(2);
      should(res).eql([
        { foo: 'first-item', id: 1 },
        { foo: 'second-item', id: 2 },
      ]);
    })
    .then(done, done);
}

// -----------------------------------------------------------

function createService(specs) {
  return proxyquire(path, {
    './crawl/getItems.js': specs.getItemsStub || sinon.stub(),
    './crawl/getItem.js': specs.getItemStub || sinon.stub(),
  });
}

'use strict';

describe('leboncoin service', () => {
  describe('.getItems', getItemsSuite);
});

function getItemsSuite() {
  it('should call getItems service then add ids', getItemsTest);
}

const BPromise = require('bluebird');
const path = '../../app/services/leboncoin.js';
const proxyquire = require('proxyquire');
const should = require('should');
const sinon = require('sinon');

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

function createService(specs) {
  return proxyquire(path, {
    './getItems.js': specs.getItemsStub,
  });
}

'use strict';

describe('template service', () => {
  describe('render', renderSuite);
});

const BPromise = require('bluebird');
const proxyquire = require('proxyquire');
const should = require('should/as-function');
const sinon = require('sinon');

const fs = {};
const handlebars = {};
const serviceFactory = proxyquire('../../app/services/template.js', {
  fs,
  handlebars,
});

function renderSuite() {
  it('should render template using given data', templateTest);
  it('should read file only once when calling multiple times', multipleCallTest);

  function templateTest(done) {
    const service = serviceFactory.create();
    const firstname = 'Jack';
    const lastname = 'Aubrey';
    const data = { firstname, lastname };
    const fileContent = 'hello {{firstname}} {{lastname}}!';
    const expectedRes = `hello ${firstname} ${lastname}!`;
    const path = 'super-path';

    fs.readFileAsync = sinon.stub().returns(BPromise.resolve(fileContent));

    service.render(path, data)
      .then((res) => {
        should(res).eql(expectedRes);
      })
      .then(done, done);
  }

  function multipleCallTest(done) {
    const service = serviceFactory.create();
    const data1 = 'suer-data-1';
    const data2 = 'suer-data-2';
    const path = 'super-path';
    const expectedRes1 = 'super-res-1';
    const expectedRes2 = 'super-res-2';
    const fileContent = 'super-content';
    const templateStub = sinon.stub();


    fs.readFileAsync = sinon.stub().returns(BPromise.resolve(fileContent));
    handlebars.compile = sinon.stub().returns(templateStub);
    templateStub.withArgs(data1).returns(expectedRes1);
    templateStub.withArgs(data2).returns(expectedRes2);

    BPromise.props({
      firstCall: service.render(path, data1),
      secondCall: service.render(path, data2),
    })
      .then((res) => service.render(path, data1)
        .then((thirdCallRes) => {
          res.thirdCall = thirdCallRes;
          return res;
        })
      )
      .then((res) => {
        should(fs.readFileAsync.callCount).equal(1);
        should(fs.readFileAsync.firstCall.args[0]).endWith(`/../templates/${path}`);
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

'use strict';

module.exports = {
  create,
};

const sinon = require('sinon');

function create() {
  return {
    info: sinon.stub(),
    debug: sinon.stub(),
    error: sinon.stub(),
    verbose: sinon.stub(),
    warn: sinon.stub(),
    silly: sinon.stub(),
  };
}

'use strict';

module.exports = {
  create,
};

const BPromise = require('bluebird');
const fs = BPromise.promisifyAll(require('fs'));
const handlebars = require('handlebars');
const templatesDir = `${__dirname}/../templates`;

function create() {
  const that = {};
  const templates = {};
  const readFilePromises = {};

  that.render = render;

  return that;

  //----------------------------------------------------------

  function render(templatePath, data) {
    return getTemplate(templatePath)
      .then((template) => template(data));
  }

  //----------------------------------------------------------

  function getTemplate(templatePath) {
    return addToTemplatesIfNotAlreadyAdded(templatePath)
      .then(() => templates[templatePath]);
  }

  function addToTemplatesIfNotAlreadyAdded(templatePath) {
    if (templates[templatePath]) {
      return BPromise.resolve();
    }
    return addToTemplates(templatePath);
  }

  function addToTemplates(templatePath) {
    if (!readFilePromises[templatePath]) {
      readFilePromises[templatePath] = readFileThenAddToTemplates(templatePath);
    }
    return readFilePromises[templatePath];
  }

  function readFileThenAddToTemplates(templatePath) {
    return fs.readFileAsync(`${templatesDir}/${templatePath}`, 'utf8')
      .then((content) => {
        templates[templatePath] = handlebars.compile(content);
        readFilePromises[templatePath] = false;
      });
  }
}

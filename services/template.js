"use strict";

module.exports = {
  create
};

const BPromise = require("bluebird"),
  fs = BPromise.promisifyAll(require("fs")),
  handlebars = require("handlebars"),
  templatesDir = __dirname + "/../templates";

function create() {
  const that = {},
    templates = {},
    readFilePromises = {};

  that.render = render;

  return that;

  ////////////////////////////////////////////////////////////

  function render(templatePath, data) {
    return getTemplate(templatePath)
      .then(function (template) {
        return template(data);
      });
  }

  ////////////////////////////////////////////////////////////

  function getTemplate(templatePath) {
    return addToTemplatesIfNotAlreadyAdded(templatePath)
      .then(function () {
        return templates[templatePath];
      });
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
    return fs.readFileAsync(templatesDir + "/" + templatePath, "utf8")
      .then(function (content) {
        templates[templatePath] = handlebars.compile(content);
        readFilePromises[templatePath] = false;
      });
  }
}

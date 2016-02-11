"use strict";

module.exports = {
  create
};

const BPromise = require("bluebird"),
  hash = require("./hash.js"),
  nightmareFactory = require("nightmare"),
  urlHelper = require("url");

function create() {
  const that = {};

  that.getItems = getItems;

  return that;

  ////////////////////////////////////////////////////////////

  function getItems(url) {
    return getItemsMetaFromLeboncoin(url)
      .then(function (items) {
        return items.map(function addIdToItem(item) {
          item.id = extractIdFromUrl(item.href);
          return item;
        });
      });
  }

  function getItemsMetaFromLeboncoin(url) {
    const nightmare = nightmareFactory();
    return new BPromise(function (resolve, reject) {
      /* globals scrollTo */
      nightmare
        .goto(url)
        .evaluate(function () {
          scrollTo(0, 2000);
        })
        .wait(500)
        .evaluate(function () {
          scrollTo(0, 3000);
        })
        .wait(500)
        .evaluate(function () {
          scrollTo(0, 4000);
        })
        .wait(500)
        .evaluate(function () {
          scrollTo(0, 5000);
        })
        .wait(500)
        .evaluate(getItemsInPage)
        .run(function (err, result) {
          if (err) {
            return reject(err);
          }
          resolve(result);
        })
        .end();
    });
  }
}

function extractIdFromUrl(url) {
  const pathname = urlHelper.parse(url).pathname;
  return hash.md5(pathname);
}

function getItemsInPage() {
  /* globals $ */
  var elements = [];
  $(".list-lbc").children("a").each(function () {
    var $element = $(this),
      element = {
        name: $element.prop("title"),
        href: $element.prop("href"),
        location: $(".placement", $element).first().text().replace(/[ \n\t]+/g, " ").trim(),
        price: $(".price", $element).first().text().replace(/[ \n\t]+/g, " ").trim(),
        imageUrl: $(".lbc .image .image-and-nb img", $element).prop("src")
      };

    elements.push(element);
  });
  return elements;
}

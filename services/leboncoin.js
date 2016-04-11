'use strict';

module.exports = {
  create,
};

const BPromise = require('bluebird');
const hash = require('./hash.js');
const nightmareFactory = require('nightmare');
const urlHelper = require('url');

function create() {
  const that = {};

  that.getItems = getItems;

  return that;

  //----------------------------------------------------------

  function getItems(url) {
    return getItemsMetaFromLeboncoin(url)
      .then((items) => items.map(addIdToItem));

    function addIdToItem(item) {
      item.id = extractIdFromUrl(item.href);
      return item;
    }
  }

  function getItemsMetaFromLeboncoin(url) {
    const nightmare = nightmareFactory();
    return new BPromise((resolve, reject) => {
      /* globals scrollTo */
      nightmare
        .goto(url)
        .evaluate(() => scrollTo(0, 2000))
        .wait(500)
        .evaluate(() => scrollTo(0, 3000))
        .wait(500)
        .evaluate(() => scrollTo(0, 4000))
        .wait(500)
        .evaluate(() => scrollTo(0, 5000))
        .wait(500)
        .evaluate(getItemsInPage)
        .run((err, result) => {
          if (err) {
            reject(err);
            return;
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
  $('.tabsContent').children('li').each(function () {
    var $element = $('a', this).first();
    var element = {
      date: $('aside.item_absolute .item_supp', $element).first().text().replace(/[ \n\t]+/g, ' ').trim(),
      name: $element.prop('title'),
      href: $element.prop('href'),
      location: $('.item_supp', $element).eq(1).text().replace(/[ \n\t]+/g, ' ').trim(),
      price: $('.item_price', $element).first().text().replace(/[ \n\t]+/g, ' ').trim(),
      imageUrl: $('.item_imagePic span img', $element).prop('src')
    };

    elements.push(element);
  });
  return elements;
}

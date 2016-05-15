'use strict';

module.exports = getItems;

const crawlerFactory = require('../crawler.js');

function getItems(url) {
  const crawler = crawlerFactory(url);
  crawler.scrollToMaxHeight();
  return crawler.execute(getItemsInPage);
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

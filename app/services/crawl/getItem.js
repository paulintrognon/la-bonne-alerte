'use strict';

module.exports = getItem;

const crawlerFactory = require('../crawler.js');

function getItem(url) {
  const crawler = crawlerFactory(url);

  return crawler.clickOn('.sidebar .button-orange.phoneNumber', '.sidebar span.phone_number')
    .then(() => crawler.execute(getItemInPage));
}

function getItemInPage() {
  var values = $('.properties .line .value');
  var item = {};

  $('.properties .line>h2').each(function (element) {
    var property = $('.property', this).first().text().trim();
    var value = $('.value', this).first().text().trim();
    if (property) {
      item[property] = value;
    }
  });

  item.images = [];
  $('.carousel .item_imagePic').each(function (element) {
    var src = $('img', this).first().attr('src');
    item.images.push('http:' + src);
  });

  item.description = $('p[itemprop="description"]').eq(0).html().trim();
  item.phoneNumber = $('.sidebar span.phone_number').text().trim();

  return item;
}

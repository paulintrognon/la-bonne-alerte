'use strict';

module.exports = getItem;

const crawler = require('../crawler.js');

function getItem(url) {
  return crawler.play(url, page => page.click('.button-orange')
    .wait('.sidebar span.phone_number')
    .evaluate(getItemInPage)
  );
}

function getItemInPage() {
  var values = $('.properties .line .value');
  var item = {};
  [
    {index: 3, name: 'nbRooms'},
    {index: 4, name: 'furnished'},
    {index: 5, name: 'surfaceArea'}
  ].forEach(function (value) {
    item[value.name] = values.eq(value.index).text().trim();
  });

  var images = [];
  $('.carousel .item_imagePic').each(function (element) {
    var src = $('img', this).first().attr('src');
    images.push('http:' + src);
  });

  item.images = images.slice(1);
  item.description = $('p[itemprop="description"]').eq(0).html().trim();
  item.phoneNumber = $('.sidebar span.phone_number').text().trim();

  return item;
}

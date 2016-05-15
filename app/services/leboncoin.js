'use strict';

module.exports = create();

const getItemsFromLbc = require('./crawl/getItems.js');
const hash = require('./hash.js');
const urlHelper = require('url');

function create() {
  const that = {};

  that.getItems = getItems;

  return that;

  //----------------------------------------------------------

  function getItems(url) {
    return getItemsFromLbc(url)
      .then(items => items.map(addIdToItem));

    function addIdToItem(item) {
      item.id = createIdFromUrl(item.href);
      return item;
    }
  }
}

function createIdFromUrl(url) {
  const pathname = urlHelper.parse(url).pathname;
  return hash.md5(pathname);
}

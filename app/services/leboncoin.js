'use strict';

module.exports = create();

const _ = require('lodash');
const BPromise = require('bluebird');
const getItemsFromLbc = require('./crawl/getItems.js');
const getItemFromLbc = require('./crawl/getItem.js');
const hash = require('./hash.js');
const urlHelper = require('url');

function create() {
  const that = {};

  that.getItems = getItems;
  that.completeItems = completeItems;

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

  function completeItems(items) {
    return BPromise.map(items, item =>
      getItemFromLbc(item.url)
        .then(itemInfo => _.assign({}, item, itemInfo))
    );
  }
}

function createIdFromUrl(url) {
  const pathname = urlHelper.parse(url).pathname;
  return hash.md5(pathname);
}

'use strict';

module.exports = {
  create,
};

const _ = require('lodash');

function create() {
  const that = {};
  const seenItemsIndex = {};

  that.detectUnseenItems = detectUnseenItems;
  that.getSeenItems = getSeenItems;
  that.markItemsAsSeen = markItemsAsSeen;

  return that;

  //----------------------------------------------------------

  function detectUnseenItems(items) {
    const newItems = items.filter(isItemUnseed);
    newItems.forEach(markItemAsSeen);
    return newItems;
  }

  function getSeenItems() {
    return _.keys(seenItemsIndex);
  }

  function markItemsAsSeen(items) {
    items.forEach(markItemAsSeen);
  }

  //----------------------------------------------------------

  function isItemUnseed(item) {
    return !Boolean(seenItemsIndex[item.id]);
  }

  function markItemAsSeen(item) {
    seenItemsIndex[item.id] = true;
  }
}

"use strict";

module.exports = {
  create
};

var _ = require("lodash");

function create() {
  var that = {},
    seenItemsIndex = {};

  that.detectUnseenItems = detectUnseenItems;
  that.getSeenItems = getSeenItems;
  that.markItemsAsSeen = markItemsAsSeen;

  return that;

  ////////////////////////////////////////////////////////////

  function detectUnseenItems(items) {
    var newItems = items.filter(isItemUnseed);
    newItems.forEach(markItemAsSeen);
    return newItems;
  }

  function getSeenItems() {
    return _.keys(seenItemsIndex);
  }

  function markItemsAsSeen(items) {
    items.forEach(markItemAsSeen);
  }

  ////////////////////////////////////////////////////////////

  function isItemUnseed(item) {
    return !Boolean(seenItemsIndex[item.id]);
  }

  function markItemAsSeen(item) {
    seenItemsIndex[item.id] = true;
  }
}

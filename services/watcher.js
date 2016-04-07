'use strict';

module.exports = {
  create,
};

const BPromise = require('bluebird');
const itemMonitorFactory = require('./itemMonitor.js');
const leboncoinService = require('./leboncoin.js').create();
const logger = require('./logger.js');

function create(parameters) {
  const that = {};
  const itemMonitorService = itemMonitorFactory.create();
  const callback = parameters.callback;
  const delay = (parameters.delay || 60) * 60 * 1000;
  const url = parameters.url;
  let intervalId;

  that.watch = watch;

  return that;

  //----------------------------------------------------------

  function watch() {
    if (intervalId) {
      logger.warn('Watcher is already watching.');
      return BPromise.resolve();
    }
    return leboncoinService.getItems(url)
      .then(itemMonitorService.markItemsAsSeen)
      .then(() => {
        intervalId = setInterval(checkIfNewItems, delay);
      });
  }

  function checkIfNewItems() {
    leboncoinService.getItems(url)
      .then(itemMonitorService.detectUnseenItems)
      .then(newItems => {
        logger.debug(`Looking for new items at ${url}...`);
        if (newItems.length > 0) {
          callback(newItems);
        } else {
          logger.debug('No new item found.');
        }
      });
  }
}

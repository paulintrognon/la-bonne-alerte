'use strict';

module.exports = {
  create,
};

const BPromise = require('bluebird');
const schedule = require('node-schedule');
const itemMonitorFactory = require('./itemMonitor.js');
const leboncoinService = require('./leboncoin.js').create();
const logger = require('./logger.js');

function create(parameters) {
  const that = {};
  const itemMonitorService = itemMonitorFactory.create();
  const callback = parameters.callback;
  const rule = parameters.rule || { minute: 0 };
  const url = parameters.url;
  let startPromise;
  let job;

  that.start = start;
  that.stop = stop;

  return that;

  //----------------------------------------------------------

  function start() {
    if (startPromise) {
      logger.warn('Watcher is already watching.');
      return BPromise.resolve();
    }
    logger.info(`Starting watcher for url ${url}.`);
    startPromise = leboncoinService.getItems(url)
      .then(itemMonitorService.markItemsAsSeen)
      .then(() => {
        job = schedule.scheduleJob(rule, checkIfNewItems);
      });
    return startPromise;
  }

  function checkIfNewItems() {
    return leboncoinService.getItems(url)
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

  function stop() {
    if (!startPromise) {
      logger.warn('Watcher is not watching.');
      return BPromise.resolve();
    }
    return startPromise.then(() => {
      logger.info(`Stopping watcher for url ${url}.`);
      job.cancel();
    });
  }
}

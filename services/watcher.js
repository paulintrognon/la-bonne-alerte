'use strict';

module.exports = {
  create,
};

const itemMonitorFactory = require('./itemMonitor.js');
const leboncoinFactory = require('./leboncoin.js');

function create() {
  const that = {};
  const leboncoinService = leboncoinFactory.create();

  that.watch = watch;

  return that;

  //----------------------------------------------------------

  function watch(parameters) {
    const itemMonitorService = itemMonitorFactory.create();
    const callback = parameters.callback;
    const delay = (parameters.delay || 60) * 60 * 1000;
    const url = parameters.url;

    return leboncoinService.getItems(url)
      .then(itemMonitorService.markItemsAsSeen)
      .then(() => {
        setInterval(executeCallbackIfNewItems, delay);
      });

    function executeCallbackIfNewItems() {
      leboncoinService.getItems(url)
        .then(itemMonitorService.detectUnseenItems)
        .then(newItems => {
          if (newItems.length > 0) {
            callback(newItems);
          } else {
            console.log('No new item found.');
          }
        });
    }
  }
}

"use strict";

module.exports = {
  create
};

var itemMonitorFactory = require("./itemMonitor.js"),
  leboncoinFactory = require("./leboncoin.js");

function create() {
  const that = {},
    leboncoinService = leboncoinFactory.create();

  that.watch = watch;

  return that;

  ////////////////////////////////////////////////////////////

  function watch(parameters) {
    const itemMonitorService = itemMonitorFactory.create(),
      callback = parameters.callback,
      delay = (parameters.delay || 60) * 60 * 1000,
      url = parameters.url;

    return leboncoinService.getItems(url)
      .then(itemMonitorService.markItemsAsSeen)
      .then(function () {
        setInterval(function () {
          leboncoinService.getItems(url)
            .then(itemMonitorService.detectUnseenItems)
            .then(callback);
        }, delay);
      });
  }
}

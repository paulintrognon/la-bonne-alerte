'use strict';

module.exports = create;

const BPromise = require('bluebird');
const nightmareFactory = require('nightmare');

function create(url) {
  const that = {};
  let page = init();

  that.clickOn = clickOn;
  that.execute = execute;
  that.scrollToMaxHeight = scrollToMaxHeight;

  return that;

  // --------------------------------------------------------

  function init() {
    const nightmare = nightmareFactory();
    return nightmare.goto(url);
  }

  function clickOn(clickSelector, waitSelector) {
    return page.exists(clickSelector)
      .then(exists => {
        if (exists) {
          page = page.click(clickSelector).wait(waitSelector);
        }
      });
  }

  function execute(callback) {
    return new BPromise((resolve, reject) => {
      page = page.evaluate(callback)
        .run((err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        })
        .end();
    });
  }

  function scrollToMaxHeight(_maxHeight) {
    const maxHeight = _maxHeight || 5000;
    for (let height = 0; height <= maxHeight; height += 1000) {
      page = scroll(page, height);
    }
  }

  function scroll(pageToScroll, height) {
    return pageToScroll.evaluate(scrollInPage, height).wait(500);
  }

  function scrollInPage(height) {
    /* globals scrollTo */
    scrollTo(0, height);
  }
}

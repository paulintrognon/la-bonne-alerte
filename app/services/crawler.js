'use strict';

module.exports = create();

const BPromise = require('bluebird');
const nightmareFactory = require('nightmare');

function create() {
  const that = {};

  that.crawl = crawl;
  that.crawlWithScroll = crawlWithScroll;

  return that;

  // --------------------------------------------------------

  function crawl(url, callback) {
    const page = goTo(url);
    return runInPage(page, callback);
  }

  function crawlWithScroll(url, callback, maxHeight) {
    const page = goTo(url);
    const pageScrolled = scrollToMaxHeight(page, maxHeight);
    return runInPage(pageScrolled, callback);
  }

  function runInPage(page, callback) {
    return new BPromise((resolve, reject) => {
      page
        .evaluate(callback)
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

  function goTo(url) {
    const nightmare = nightmareFactory();
    return nightmare.goto(url);
  }

  function scrollToMaxHeight(page, _maxHeight) {
    const maxHeight = _maxHeight || 5000;
    let pageScrolled = page;
    for (let height = 0; height <= maxHeight; height += 1000) {
      pageScrolled = scroll(pageScrolled, height);
    }
    return pageScrolled;
  }

  function scroll(page, height) {
    return page.evaluate(scrollInPage, height).wait(500);
  }

  function scrollInPage(height) {
    /* globals scrollTo */
    scrollTo(0, height);
  }
}

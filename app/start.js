'use strict';

const config = require('./config/config.json');
const logger = require('./services/logger.js');
const watcherFactory = require('./services/watcher.js');
const template = require('./services/template.js').create();
const mailer = require('./services/mailer.js').create({ sender: config.email.from, auth: config.email.auth });
const argv = require('yargs')
  .usage('Usage: $0 --url [url] --recipients [recipients]')
  .alias('url', 'u')
  .alias('recipients', 'r')
  .demand(['u', 'r'])
  .argv;

const searchUrl = argv.url;
const recipients = argv.recipients;

const watcher = watcherFactory.create({
  url: searchUrl,
  callback: sendmail,
});
watcher.start()
  .then(() => {
    logger.info('Application has started.');
    process.on('SIGINT', stop);
    process.on('SIGTERM', stop);
  });

function stop() {
  watcher.stop()
    .then(() => {
      logger.info('Application has stopped.');
    });
}

function sendmail(items) {
  template.render('newItems.hbs', { searchUrl, items })
    .then(html => {
      logger.info(`sending a mail! (${items.length} new items)`);
      mailer.mail({
        html,
        recipients,
        subject: 'Nouvelles annonces leboncoin :)',
      });
    });
}

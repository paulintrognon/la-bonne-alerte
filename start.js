'use strict';

const config = require('./config/config.json');
const logger = require('./services/logger.js');
const watcher = require('./services/watcher.js').create();
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

logger.info('Starting!');
watcher.watch({
  url: searchUrl,
  callback: sendmail,
});

function sendmail(items) {
  template.render('newItems.tpl', { searchUrl, items })
    .then(html => {
      logger.info(`sending a mail! (${items.length} new items)`);
      mailer.mail({
        html,
        recipients,
        subject: 'Nouvelles annonces leboncoin :)',
      });
    });
}

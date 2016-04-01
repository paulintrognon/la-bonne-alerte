'use strict';

const config = require('./config/config.json');
const watcher = require('./services/watcher.js').create();
const template = require('./services/template.js').create();
const mailer = require('./services/mailer.js').create({ sender: config.email.from, auth: config.email.auth });

console.log('Starting!');
watcher.watch({
  url: 'http://www.leboncoin.fr/colocations/offres/rhone_alpes/?th=1&location=Lyon%2069007%2CLyon%2069003%2CLyon%2069002',
  callback: sendmail,
});

function sendmail(items) {
  template.render('newItems.tpl', { items })
    .then((html) => {
      console.log(`sending a mail! (${items.length} new items)`);
      mailer.mail({
        html,
        recipients: 'paulin.trognon@gmail.com',
        subject: 'Nouvelles annonces leboncoin :)',
      });
    });
}
/*
require('./services/leboncoin.js').create().getItems('http://www.leboncoin.fr/electromenager/offres/rhone_alpes/?f=a&th=1&ps=8&q=four&it=1&location=Lyon')
  .then((items) => template.render('newItems.tpl', { items }))
  .then((html) => {
    console.log('sending mail');
    mailer.mail({
      html,
      text: 'test',
      recipients: 'paulin.trognon@gmail.com',
      subject: 'Nouvelles annonces leboncoin :)',
    });
  });*/

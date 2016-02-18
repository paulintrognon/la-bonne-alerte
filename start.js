"use strict";

var leboncoin = require("./services/leboncoin.js").create();

leboncoin.getItems("http://www.leboncoin.fr/electromenager/offres/rhone_alpes/?f=a&th=1&ps=8&q=four&it=1&location=Lyon")
  .then(function functionName(items) {
    items.forEach(function (item) {
      console.log(item);
    });
    console.log("end");
  });

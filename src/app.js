var config = require('config');
var main = require('./app/main.js');

main.process(config.tradetrackercom_url, config.tradetrackercom_watzdprice_url, config.tradetrackercom_shop, function (err) {
  if (err) {
    console.error(JSON.stringify(err));
  }
});

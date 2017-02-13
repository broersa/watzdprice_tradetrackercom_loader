var config = require('config');
var main = require('./app/main.js');

console.log(JSON.stringify(config));

main.process(config.tradetrackercom_url, config.tradetrackercom_watzdprice_url, config.tradetrackercom_shop, function (error) {
  if (error) {
    console.error(error);
  }
});

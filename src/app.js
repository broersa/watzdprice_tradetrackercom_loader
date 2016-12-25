var config = require('config');
var main = require('./app/main.js');

console.log(config.tradetrackercom_url);
console.log(config.tradetrackercom_shop);
console.log(config.tradetrackercom_elastic_url);
console.log(config.tradetrackercom_elastic_index);

main.process(config.tradetrackercom_url, config.tradetrackercom_elastic_url, config.tradetrackercom_elastic_index, config.tradetrackercom_shop, function (error) {
  if (error) {
    console.log(error);
  }
});

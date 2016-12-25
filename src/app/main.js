var async = require('async');
var moment = require('moment');
var tradeTrackerCom = require('../dal/tradeTrackerCom.js');
var watzdprice = require('watzdprice');

module.exports = {
  process: function(url, elastic_url, elastic_index, shop, cb) {
    tradeTrackerCom.getTradeTrackerComData(url, function(data) {
      watzdprice.startSession(elastic_url, function (error, client) {
        if (error) {
          return cb(error);
        }
        async.eachLimit(data.products, 1, function (i, cb) {
          var product = {
            name: i.name,
            description: i.description,
            eancode: i.properties.EAN[0],
            shop: shop,
            category: '',
            price: i.price.amount,
            url: i.URL,
            image: i.images[0]
          };
          watzdprice.updateProduct(client, elastic_index, moment(), product, cb);
        }, function (error) {
          if (error) {
            return cb(error);
          }
          return cb()
        });
      });
    });
  }
}

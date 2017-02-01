var async = require('async');
var moment = require('moment');
var tradeTrackerCom = require('../dal/tradeTrackerCom.js');
var url = require('url');
var http = require('http');

module.exports = {
  process: function(tradetracker_url, watzdprice_url, shop, cb) {
    var start = moment().format();
    var added = 0;
    var updated = 0;
    var urlDetails = url.parse(watzdprice_url);
    tradeTrackerCom.getTradeTrackerComData(tradetracker_url, function(data) {
      async.eachLimit(data.products, 1, function (i, cb) {
        var product = {
          name: i.name,
          description: i.description,
          eancode: i.properties.EAN[0],
          shop: shop,
          category: '',
          price: i.price.amount,
          url: i.URL,
          image: i.images[0],
          datetime: moment().format()
        };
        putProduct(urlDetails, JSON.stringify(product), function (err, operation) {
          if (operation === 'added') {
            added++;
          }
          if (operation === 'updated') {
            updated++;
          }
          cb(err);
        });
      }, function (error) {
        if (error) {
          return cb(error);
        }
        return postShopLoadStats(urlDetails, JSON.stringify({
          shop: shop,
          start: start,
          end: moment().format(),
          added: added,
          updated: updated
        }), cb);
      });
    });
  }
}

function putProduct (urlDetails, product, callback) {
  var put_options = {
    host: urlDetails.hostname,
    port: urlDetails.port,
    path: '/updateproduct',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(product)
    }
  };

  // Set up the request
  var put_req = http.request(put_options, function(res) {
      res.setEncoding('utf8');
      var body = '';
      res.on('data', function (chunk) {
        body = body + chunk;
      });
      res.on('end', function() {
        var d = JSON.parse(body);
        callback(null, d.operation);
      })
  });

  // post the data
  put_req.write(product);
  put_req.end();
}

function postShopLoadStats (urlDetails, shopLoadStats, callback) {
  var post_options = {
    host: urlDetails.hostname,
    port: urlDetails.port,
    path: '/addshoploadstats',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(shopLoadStats)
    }
  };

  // Set up the request
  var put_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('end', function() {
        callback(null);
      })
  });

  // post the data
  put_req.write(shopLoadStats);
  put_req.end();
}

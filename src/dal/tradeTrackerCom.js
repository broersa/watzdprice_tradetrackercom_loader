var http = require('http');
var MyError = require('../MyError.js');

module.exports = {
  getTradeTrackerComData: function(url, callback) {
    return http.get(url, function(response) {
      // Continuously update stream with data
      var body = '';
      response.on('data', function(d) {
          body += d;
      });
      response.on('end', function() {
        // Data reception is done, do whatever with it!
        var parsed = JSON.parse(body);
        callback(null, parsed);
      });
      response.on('error', function(err) {
        callback(new MyError('ERROR', 'getTradeTrackerComData', 'Error', {url: url}, err));
      });
    });
  }
}

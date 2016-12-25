var http = require('http');

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
          callback(parsed);
      });
    });
  }
}
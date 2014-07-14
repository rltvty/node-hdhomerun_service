var http = require('http');
var globals = require('./lib/globals');
var express_app = require('./lib/express_app');

var server = null;

globals.logger.info('Running on node version: ' + process.version);

module.exports.start = function() {
  if (server == null) {
    server = http.createServer(express_app());
    server.listen(globals.config.http_server_port);
    globals.logger.info('Server listening on port '+ globals.config.http_server_port);
  }
};

module.exports.stop = function() {
  if (server != null) {
    server.close();
    server = null;
    globals.logger.info('Server stopped listening on port '+ globals.config.http_server_port);
  }
};

module.exports.start();

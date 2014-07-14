var bunyan = require('bunyan');
var config = require('./config.js');

var global_namespace_key = 'hdhomerun_service_global';

if (!(global_namespace_key in process)) {
  var globals = {};

  globals.config = config(process.env.NODE_ENV);

  var logging_streams = [
    {
      path: globals.config.logging_path,
      level: globals.config.logging_level
    }
  ];

  if (globals.config.verbose) {
    logging_streams.push({
        level: globals.config.logging_level,
        stream: process.stdout
      });
  }

  globals.logger = bunyan.createLogger({
    name: 'hdhomerun_service',
    streams: logging_streams
  });

  process[global_namespace_key] = globals;
  globals.logger.info('Initialized global object');
}

module.exports = {
  config : process[global_namespace_key].config,
  logger : process[global_namespace_key].logger
};

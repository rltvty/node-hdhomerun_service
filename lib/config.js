var inspect = require('util').inspect;
var fs = require('fs');
var os = require('os');
var yaml = require('js-yaml');
var command_args = require('./command_args.js');

module.exports = function(environment) {
  if (environment == undefined || environment == null) {
    environment = 'development';
  }

  var local_config = require('../config.yml')[environment];

  return {
    logging_path : local_config['logging_path'],
    logging_level : local_config['logging_level'],
    verbose: command_args.verbose,
    http_server_port : local_config['http_server_port'],
    is_production: environment === 'production',
    is_development: environment === 'development'
  };
};

var http = require('http');
var rest_base = require('rest_base');
var hdhr = require('./lib/hd_wrapper');

rest_base.start_server();
hdhr.discover();

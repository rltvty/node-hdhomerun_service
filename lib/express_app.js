var express = require('express');
var bodyParser = require('body-parser');
var globals = require('./globals');
var express_logger = require('./express_logger');

module.exports = function(){
  var app = express();

  app.use(express_logger.express_logger(globals.logger));
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());

  app.get('/ping', function(request, response){
    response.send(200, 'pong');
  });

  return app;
};

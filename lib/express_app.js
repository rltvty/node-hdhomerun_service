var express = require('express');
var hal = require('express-hal');
var bodyParser = require('body-parser');
var globals = require('./globals');
var express_logger = require('./express_logger');

module.exports = function(){
  var app = express();

  app.use(hal.middleware);
  app.use(express_logger.express_logger(globals.logger));
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());

  app.get('/ping', function(request, response){
    response.send(200, 'pong');
  });

  //root
  app.get('/', function (req, res, next) {
    res.hal({
      links: {
        self: { href: '/', method: 'get' },
        log: { href: '/log', method: 'get' },
        channel_list: { href: '/channels', method: 'get'},
        tuner_list: { href: '/tuners', method: 'get'}
      }
    });
  });

  app.get('/channels', function(req, res, next) {
    res.hal({
      data: [
        {
          callsign : 'KTBC-HD',
          number: 23.1,
          favorite: false
        }
      ],
      links: {
        self: { href: '/channels', method: 'get' },
        detect_channels: { href: '/channels/detect?{:callback_url}', method: 'post', templated: true},
        detect_channels_status: { href: '/channels/detect', method: 'get'},
        mark_favorite: { href: '/channels/favorite/:bool_value', method: 'post', templated: true}
      }
    });
  });

  app.get('/tuners', function(req, res, next) {
    res.hal({
      data: [
        {
          id : 0,
          virtual_channel: null,
          frequency: null,
          program_number: null,
          modulation_lock: null,
          signal_strength: null,
          signal_quality: null,
          symbol_quality: null,
          streaming_rate: null,
          resource_lock: null
        }
      ],
      links: {
        self: { href: '/tuners', method: 'get' },
        tuner_status: { href: '/tuners/:tuner_id', method: 'get', templated: true},
        start_stream: { href: '/tuners/:tuner_id?{:ip_address}', method: 'post', templated: true},
        channel_up: { href: '/tuners/:tuner_id/channel_up', method: 'post', templated: true},
        channel_down: { href: '/tuners/:tuner_id/channel_down', method: 'post', templated: true},
        channel_favorite_up: { href: '/tuners/:tuner_id/channel_favorite_up', method: 'post', templated: true},
        channel_favorite_down: { href: '/tuners/:tuner_id/channel_favorite_down', method: 'post', templated: true}
      }
    });
  });

  return app;
};

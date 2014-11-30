var hdhr = require('hdhomerun');
var globals = require('rest_base');

var device = null;

module.exports.discover = function() {
    device = null;
    hdhr.discover(function (error, result) {
        if (error) {
            globals.logger.error(error);
        } else if (result.length == 1) {
            device = hdhr.create(result[0]);
            globals.logger.info('hdhomerun device %s found at %s', device.device_id, device.device_ip);
        } else {
            globals.logger.error('Found %d hdhomerun devices', result.length);
        }
    });
};

var channel_list = null;
module.exports.channel_list = function(callback) {
    if (device == null) {
        callback(new Error('Device not available'));
    } else if (channel_list == null) {
      globals.request.get('http://' + device.device_ip + '/lineup.json', function(error, response) {
          if (error || response.statusCode != 200) {
              callback(error || 'could not fetch lineup from device');
          } else {
              channel_list = [];
              var lineup_items = JSON.parse(response.body);

              for (var item_index in lineup_items) {
                  var lineup_item = lineup_items[item_index];
                  channel_list.push({
                      name: lineup_item['GuideName'],
                      number: lineup_item['GuideNumber']
                  });
              }
              callback(null, channel_list);
          }
      });
    } else {
        callback(null, channel_list);
    }
};

module.exports.set_channel = function(tuner, channel, callback) {
    if (device) {
        device.set('/tuner' + tuner + '/vchannel', channel, function (err, res) {
            if (err) {
                globals.logger.error('Error setting channel: ', err);
            } else if (res) {
                globals.logger.info('Response setting channel: ', res);
            }
            callback(err, res);
        });
    }
};

module.exports.start_stream = function(tuner, ip_and_port, callback) {
    if (device) {
        device.set('/tuner' + tuner + '/target', ip_and_port, function (err, res) {
            if (err) {
                globals.logger.error('Error starting stream: ', err);
            } else if (res) {
                globals.logger.info('Response starting stream: ', res);
            }
            callback(err, res);
        });
    }
};

module.exports.stop_stream = function(tuner, callback) {
    if (device) {
        device.set('/tuner' + tuner + '/target', 'none', function (err, res) {
            if (err) {
                globals.logger.error('Error stopping stream: ', err);
            } else if (res) {
                globals.logger.info('Response stopping stream: ', res);
            }
            callback(err, res);
        });
    }
};

module.exports.get_status = function(tuner, callback) {
    if (device) {
        device.get('/tuner' + tuner + '/status', function (err, res) {
            if (err) {
                globals.logger.error('Error getting status: ', err);
                callback(err);
            } else if (res) {
                globals.logger.info('Response getting status: ', res);
                var output = {
                    tuner: tuner
                };

                var status_items = res.value.split(' ');
                for (var item_index in status_items) {
                    var key_value_array = status_items[item_index].split('=');
                    output[key_value_array[0]]=key_value_array[1];
                }
                callback(null, output);
            }
        });
    }
};

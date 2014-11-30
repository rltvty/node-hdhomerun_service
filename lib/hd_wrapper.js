var hdhr = require('hdhomerun');
var globals = require('rest_base');

var device = null;
var channel_list = null;
var current_channel = {0:null, 1:null};

module.exports.startup = function() {
    find_device(function(find_error) {
        if (!find_error) {
            get_channel_list(function(error, channel_list){
                if (channel_list != null && channel_list.length > 0) {
                    module.exports.set_channel(0,channel_list[0].number, function() {
                        module.exports.set_channel(1,channel_list[0].number, function() {});
                    });
                }
            });
        }
    });
};

module.exports.channel_list = function(callback) {
    if (device == null) {
        callback(new Error('Device not available'));
    } else if (channel_list == null) {
        callback(new Error('Channel list not available'));
    } else {
        callback(null, channel_list);
    }
};


module.exports.set_channel = function(tuner, channel, callback) {
    set_channel(tuner, channel, callback);
};

module.exports.channel_up = function(tuner, callback) {
    console.log('0');
    if (channel_list) {
        console.log('1');
        var channel_index = globals._.find(channel_list, function(item) { return item.number == current_channel[tuner]});
        console.log('2');
        channel_index += 1;
        console.log('3');
        if (channel_index == channel_list.length) {
            channel_index = 0;
        }
        console.log('4');
        var new_channel = channel_list[channel_index].number;
        console.log('5');
        globals.logger.info('About to set tuner %s to channel %s', tuner, new_channel);
        console.log('6');
        set_channel(tuner, new_channel, callback);
    }
};

module.exports.channel_down = function(tuner, callback) {
    if (channel_list) {
        var channel_index = globals._.find(channel_list, function(item) { return item.number == current_channel[tuner]});
        if (channel_index == 0) {
            channel_index = channel_list.length;
        }
        channel_index -= 1;
        var new_channel = channel_list[channel_index].number;
        globals.logger.info('About to set tuner %s to channel %s', tuner, new_channel);
        set_channel(tuner, new_channel, callback);
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

function find_device(callback) {
    device = null;
    hdhr.discover(function (error, result) {
        if (error) {
            globals.logger.error(error);
            callback(error);
        } else if (result.length == 1) {
            device = hdhr.create(result[0]);
            globals.logger.info('hdhomerun device %s found at %s', device.device_id, device.device_ip);
            callback(null, device);
        } else {
            globals.logger.error('Found %d hdhomerun devices', result.length);
            callback(new Error('Found more than 1 hdhomerun devices.'));
        }
    });
}

function set_channel(tuner, channel, callback) {
    if (device) {
        device.set('/tuner' + tuner + '/vchannel', channel, function (err, res) {
            if (err) {
                globals.logger.error('Error setting channel: ', err);
            } else if (res) {
                current_channel[tuner] = channel;
                globals.logger.info('Response setting channel: ', res);
            }
            callback(err, res);
        });
    }
}

function get_channel_list(callback) {
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
}

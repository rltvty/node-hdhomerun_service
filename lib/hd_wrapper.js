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

module.exports.set_target = function(tuner, ip_and_port, callback) {
    if (device) {
        device.set('/tuner' + tuner + '/target', ip_and_port, function (err, res) {
            if (err) {
                globals.logger.error('Error setting target: ', err);
            } else if (res) {
                globals.logger.info('Response setting target: ', res);
            }
            callback(err, res);
        });
    }
};

module.exports.get_status = function(tuner, callback) {
    if (device) {
        device.get('/tuner' + tuner + '/status', function (err, res) {
            if (err) {
                globals.logger.error('Error setting status: ', err);
            } else if (res) {
                globals.logger.info('Response setting status: ', res);
            }
            callback(err, res);
        });
    }
};

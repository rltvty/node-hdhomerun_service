var hdhr = require('hdhomerun');
var globals = require('rest_base');

var device = null;

module.exports.discover = function() {
    device = null;
    hdhr.discover(function (error, result) {
        if (error) {
            globals.logger.error(error);
        } else if (result.length == 1) {
            device = result[0];
            globals.logger.info('hdhomerun device %s found at %s', device.device_id, device.device_ip);
        } else {
            globals.logger.error('Found %d hdhomerun devices', result.length);
        }
    });
};


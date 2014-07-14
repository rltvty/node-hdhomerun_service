var inspect = require('util').inspect;

module.exports.express_logger = function(logger) {
  return function(req, res, next) {
    res.locals.logger = logger;
    res.locals.log_prefix = 'Request: ' + req.method + ' ' + req.url;
    logger.info('Request: ' + req.method + ' ' + req.url);
    logger.info('Query Parameters: ' + inspect(req.query));

    function log_response() {
      res.removeListener('finish', log_response);
      res.removeListener('close', log_response);
      logger.info('Response: ' + req.method + ' ' + req.url + ' ' + res.statusCode);
    }

    res.on('finish', log_response);
    res.on('close', log_response);
    next();
  }
};

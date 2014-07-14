module.exports = function() {
  var command_args = {};

  function showHelp() {
    console.log('Usage: node ./hdhomerun_service.js [options]');
    console.log('');
    console.log('Options:');
    console.log('--help         show this help and quit immediately');
    console.log('--verbose      log to stdout in addition to log files');
    process.exit();
  }

  process.argv.forEach(function(val, index, array) {
    if (array.indexOf('--help') > -1) {
      showHelp();
    } else {
      command_args.verbose = array.indexOf('--verbose') > -1;
    }
  });

  return command_args;
}();

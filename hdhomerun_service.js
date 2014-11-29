var http = require('http');
var rest_base = require('rest_base');
var hdhr = require('./lib/hd_wrapper');

function simple_response_handler(response) {
    return function(err, result) {
        if (err) {
            response.status(500).send(result);
        } else {
            response.status(200).send(result);
        }
    }
}

function setup_routes(app) {
    app.get('/pingy', function(request, response){
        response.status(200).send('pongy');
    });

    app.get('/status', function(request, response) {
        hdhr.get_status(0, simple_response_handler(response));
    });

    app.get('/channel/:channel_number', function(request, response) {
        hdhr.set_channel(0, request.params.channel_number, simple_response_handler(response));
    });

    app.get('/start_stream', function(request, response) {
        require('dns').lookup(require('os').hostname(), function (err, add) {
            hdhr.set_target(0, add + ':5000', simple_response_handler(response));
        });
    });
}

rest_base.set_setup_routes_method(setup_routes);
rest_base.start_server();
hdhr.discover();

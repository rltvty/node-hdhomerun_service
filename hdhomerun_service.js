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

    app.get('/channel/list', function(request, response) {
        hdhr.channel_list(simple_response_handler(response));
    });

    app.get('/channel/:channel_number/favorite', function(request, response) {
        hdhr.toggle_favorite(request.params['channel_number'], true, simple_response_handler(response));
    });

    app.get('/channel/:channel_number/dislike', function(request, response) {
        hdhr.toggle_favorite(request.params['channel_number'], false, simple_response_handler(response));
    });

    app.get('/tuner/:tuner_number/status', function(request, response) {
        hdhr.get_status(request.params['tuner_number'], simple_response_handler(response));
    });

    app.get('/tuner/:tuner_number/channel/up', function(request, response) {
        hdhr.channel_up(request.params['tuner_number'], simple_response_handler(response));
    });

    app.get('/tuner/:tuner_number/channel/down', function(request, response) {
        hdhr.channel_down(request.params['tuner_number'], simple_response_handler(response));
    });

    app.get('/tuner/:tuner_number/channel/:channel_number', function(request, response) {
        hdhr.set_channel(request.params['tuner_number'], request.params['channel_number'], simple_response_handler(response));
    });

    app.get('/tuner/:tuner_number/favorite/up', function(request, response) {
        hdhr.favorite_up(request.params['tuner_number'], simple_response_handler(response));
    });

    app.get('/tuner/:tuner_number/favorite/down', function(request, response) {
        hdhr.favorite_down(request.params['tuner_number'], simple_response_handler(response));
    });

    app.get('/tuner/:tuner_number/start_stream/:ip_address', function(request, response) {
        hdhr.start_stream(request.params['tuner_number'], request.params['ip_address'] + ':5000', simple_response_handler(response));
    });

    app.get('/tuner/:tuner_number/stop_stream', function(request, response) {
        hdhr.stop_stream(request.params['tuner_number'], simple_response_handler(response));
    });
}

rest_base.set_setup_routes_method(setup_routes);
rest_base.start_server();
hdhr.startup();

var http = require('http');
var rest_base = require('rest_base');
var hdhr = require('./lib/hd_wrapper');

function setup_routes(app) {
    app.get('/pingy', function(request, response){
        response.status(200).send('pongy');
    });
};

rest_base.set_setup_routes_method(setup_routes);
rest_base.start_server();
hdhr.discover();


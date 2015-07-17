var Hapi    = require('hapi');
var handlebars = require('handlebars');
var server  = new Hapi.Server();
var init = require('./init.js');

var serverOptions = {
  port: process.env.PORT || 8000,
};

server.connection(serverOptions);

server.views({
    engines: {
        html: handlebars
    },
    relativeTo: __dirname,
    path: '../public/views'
});

server.route(require('./routes.js'));

server.start(function(){
    init.init(server.listener, function(){
        console.log('server running');
    });
});

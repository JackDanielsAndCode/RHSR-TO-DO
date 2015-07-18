var Hapi    = require('hapi');
var server  = new Hapi.Server();
var init = require('./init.js');

var serverOptions = {
  port: process.env.PORT || 8000,
};

server.connection(serverOptions);

server.route(require('./routes.js'));

server.start(function(){
    init.init(server.listener, function(){
        console.log('server running');
    });
});

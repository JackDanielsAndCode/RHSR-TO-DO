var Hapi    = require('hapi');
var server  = new Hapi.Server();
var handlebars = require('handlebars');
var DB = require('./handlers/DBAdaptor');


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

server.start(function () {
    console.log('Server running at: ' + server.info.uri);
});

var pub = DB.pub;
var sub= DB.sub;

pub.on("ready", function () {
    sub.on("ready", function () {
        sub.on("message", function (channel, message) {

            if (channel === "task-room") {
                io.emit("new-task", JSON.parse(message));
            }

            if (channel === "completion-update-room") {
                io.emit("completion-update", message);
            }
        });

        sub.subscribe("task-room","completion-update-room");
        var io = require('socket.io')(server.listener);
        io.on('connection', function(socket){
            console.log('User Connected');
            socket.on("new-task", function(data) {
                console.log("data", data);
                DB.create(data, function(result){

                    if (result.success) {
                        pub.publish("task-room", JSON.stringify(result.taskObj));
                    }
                });
            });
            socket.on("completion-change", function(updateObj) {
                DB.toggleCompletion(updateObj.ID,updateObj.status,function(result){
                        pub.publish("completion-update-room", updateObj.ID);
                });
            });
        });
    });
});





module.exports = server;

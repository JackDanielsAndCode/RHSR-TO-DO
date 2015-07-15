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
            console.log('message', message);
            if (channel === "task-room") {
                io.emit("new-task", JSON.parse(message));
            }

            if (channel === "update-room") {
                io.emit("task-update", JSON.parse(message));
            }

            if (channel === "delete-room") {
                io.emit("task-deletion", message);
            }
        });

        sub.subscribe("task-room", "update-room", "delete-room");
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
            socket.on("update-task", function (updateObj) {
                DB.updateByTaskID(updateObj.taskID,updateObj,function(result){
                        pub.publish("update-room", JSON.stringify(updateObj));
                });
            });
            socket.on("delete-task", function (taskID) {
                DB.deleteByTaskID(taskID, function(result){
                    // if result good?
                    pub.publish("delete-room",taskID);
                });
            });
        });
    });
});





module.exports = server;

var Hapi    = require('hapi');
var server  = new Hapi.Server();
var handlebars = require('handlebars');
var DB = require('./handlers/DBAdaptor');
var socketio = require('socket.io');
var io;
var pub = DB.pub;
var sub= DB.sub;


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

function init(listener, callback){
    io = socketio.listen(listener);
    pub.on("ready", function () {
        sub.on("ready", function () {
            sub.subscribe("task-created", "task-updated", "task-deleted");
            sub.on("message", function (channel, message) {
                io.emit(channel, message);
            });
            io.on('connection', taskHandler);
            callback();
        });
    });
}

function taskHandler(socket){
    console.log("client connected");

    socket.on("create-task", function(data) {
        console.log("hi", data);
        DB.create(data, function(result){

            if (result.success) {
                pub.publish("task-created", JSON.stringify(result.taskObj));
            }
        });
    });
    socket.on("update-task", function (updateObj) {
        DB.updateByTaskID(updateObj.taskID,updateObj,function(result){
            pub.publish("task-updated", JSON.stringify(updateObj));
        });
    });
    socket.on("delete-task", function (taskID) {
        DB.deleteByTaskID(taskID, function(result){
            // if result good?
            pub.publish("task-deleted",taskID);
        });
    });
}

server.start(function(){
    init(server.listener, function(){
        console.log('server running');
    });
});

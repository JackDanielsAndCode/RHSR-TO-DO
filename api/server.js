var Hapi    = require('hapi');
var server  = new Hapi.Server();
var handlebars = require('handlebars');
var DB = require('./handlers/DBAdaptor');
var socketio = require('socket.io');
var io;
var pub = DB.pub;
var sub= DB.sub;
console.log(sub);


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
          console.log(this);
          sub.subscribe("task-room", "update-room", "delete-room");
          console.log(this);
          io.on('connection', taskHandler);
          setTimeout(function(){
            callback();
          }, 300);
      });
  });
}

function taskHandler(socket){
  socket.on("new-task", function(data) {
      DB.create(data, function(result){
          console.log('pub is publishing');

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
  sub.on("message", function (channel, message) {
      console.log(this);
      console.log(channel,message, new Date().getTime(), "look here");

      if (channel === "task-room") {
          console.log('socket is emitting a new task');
          io.emit("new-task", JSON.parse(message));
      }

      if (channel === "update-room") {
          io.emit("task-update", JSON.parse(message));
      }

      if (channel === "delete-room") {
          io.emit("task-deletion", message);
      }
  });
}

server.start(function(){
  init(server.listener, function(){
      console.log('server running');
  });
});



module.exports = server;

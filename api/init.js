var socketio    = require('socket.io');
var taskHandler = require('./handlers/taskHandler.js');
var DB          = require("./DBAdaptor.js");
var url         = require('url');
var redis       = require('redis');
var config      = require('../config.json');
var redisURL    = url.parse(config.redisUrl); //set up config and use your redis url or your local redis with this url "redis://localhost:6379"
var dbNumber    = config.dbNumber; //this selects the database
var pub         = createDbClient();
var sub         = createDbClient();
var io;


function createDbClient() {

    var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
    if (redisURL.auth) { client.auth(redisURL.auth.split(":")[1]); }
    client.select(dbNumber, function() {
      // console.log("arguments >>>", arguments);
    });
    // console.log("client >>>", client);
    return client;
}


module.exports = {
    init: function (listener, callback) {

        io = socketio.listen(listener);
        pub.on("ready", function () {
            sub.on("ready", function () {
              console.log('init');
                sub.subscribe("task-created", "task-updated", "task-deleted");
                sub.on("message", function (channel, message) {
                    io.emit(channel, message);
                });
                taskHandler(io, pub);
                callback();
            });
        });
    },

    loadExistingHandler: function (callback) {
        DB.readAll(pub,callback);
    }

};

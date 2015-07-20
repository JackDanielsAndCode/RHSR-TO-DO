var init = require('../../../api/init.js');
var cheerio = require('cheerio');
var redis       = require('redis');
var url         = require('url');
var config      = process.env.REDIS_URL ? {redisUrl: process.env.REDIS_URL, dbNumber:process.env.DB_NUMBER} : require('../../../config.json'); //set up config and use your redis url or your local redis with this url "redis://localhost:6379", second part for heroku
var redisURL    = url.parse(config.redisUrl);
var dbNumber    = config.dbNumber; //this selects the database
var pub         = createDbClient();
var sub         = createDbClient();
io              = require("socket.io");
var todo;


var riot = require("riot");

require("../../../src/tags/to-do.tag");
require("../../../src/tags/new-task.tag");
require("../../../src/tags/task-list.tag");
require("../../../src/tags/task.tag");

init.loadExistingHandler(pub,function(data){
    todo = riot.render("to-do", {
        taskItems: data,
        name: "Jack"
    });
    $ = cheerio.load(todo);
    console.log($.html());
    $('#addButton').click();
    console.log($.html());
});

function createDbClient() {

   var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
   if (redisURL.auth) { client.auth(redisURL.auth.split(":")[1]); }
   client.select(dbNumber, function() {
     // console.log("arguments >>>", arguments);
   });
   // console.log("client >>>", client);
   return client;
}

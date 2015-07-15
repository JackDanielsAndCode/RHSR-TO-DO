var url = require('url');
var redis =   require('redis');
var redisURL = url.parse(process.env.REDISCLOUD_URL);
var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
client.auth(redisURL.auth.split(":")[1]);
var pub = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
pub.auth(redisURL.auth.split(":")[1]);
var sub = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
sub.auth(redisURL.auth.split(":")[1]);


function addToOrderedSet (setName, score, element, callback) {
    client.zadd(setName, score, element, callback);
}

function increment (key, callback) {
    client.incr(key, callback);
}

function addToHash (key, propObj, callback) {
    client.hmset(key, propObj, callback);
}

function insertIntoList (list, scoreFunction, taskObj, callback) {
    var score = scoreFunction(taskObj);
    addToOrderedSet(list, score, taskObj.taskID, callback);
}

function sortByTime (taskObj) {
    return taskObj.time;
}

function insertIntoList (list, scoreFunction, obj, callback) {
    var score = scoreFunction(obj);
    addToOrderedSet(list, score, obj.taskID, function (err, result) {

        if (err) {
            console.log(err);
        } else {
            callback ({    // ideally callback shoudl be err result but not while rogue code
                    success:result,
                    taskObj:obj
                });
        }
    });
}

function create (taskObj, callback) {

    client.select(0, function() {
      increment("task-count", function (err, taskID) {

          if (err) {
              console.log(err);
          } else {
              var createTime = new Date().getTime();
              taskObj.time = createTime;
              taskObj.complete = "";
              taskObj.taskID = taskID;

              addToHash(taskID, taskObj, function (err, result) {

                  if (err) {
                      console.log(err);
                  } else {
                      insertIntoList("primary-list", sortByTime, taskObj, callback); //possible to add to multiple lists with different scoring systems
                  }
              });
          }
      });
    });
}

function updateByTaskID (taskID, changeObj, callback) {

    client.select(0, function() {
      client.hmset(taskID, changeObj, function(err, result) {

          if(!err) {
              callback(result); //if successful will be 0
          }
      });
    });
}

function deleteByTaskID (taskID, callback) {

    client.select(0, function() {
      client.zrem("primary-list", taskID, function(err, result) {

          if(!err) {
              callback(result); //if successful will be 0
          }
      });
    });
}

function readAll(callback) {
    client.select(0, function() {
        client.zrange("primary-list",0,-1, function(err, data){
            if (err) {
                console.log(err);
            } else {
                var multi = client.multi();
                data.forEach(function (taskID) {
                  multi.hgetall(taskID,function(err,reply){
                    if (err) {console.log(err);}
                  });
                });
                multi.exec(function (err, replies) {
                  return callback(replies);
                });
            }
        });

    });

}

module.exports = {
    create: create,
    readAll: readAll,
    updateByTaskID: updateByTaskID,
    deleteByTaskID: deleteByTaskID,
    pub: pub,
    sub: sub
};

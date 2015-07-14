var redis =   require('redis');
var client =  redis.createClient();

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

function insertIntoPrimaryList (obj, callback) {
    insertIntoList("primary-list", sortByTime, obj, function (err, result) {

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

///change!!

function create (taskObj, callback) {

    client.select(0, function() {
      increment("task-count", function (err, taskID) {

          if (err) {
              console.log(err);
          } else {
              taskObj.time = new Date().getTime();
              taskObj.complete = false;
              taskObj.taskID = taskID;

              addToHash(taskID, taskObj, function (err, result) {

                  if (err) {
                      console.log(err);
                  } else {
                      insertIntoPrimaryList(taskObj, callback);
                  }
              });
          }
      });
    });
}

function toggleCompletion (taskID, currentStatus, callback) {

    client.select(0, function() {
      client.hset(taskID, "complete", !currentStatus, function(err, result) {

          if(!err) {
              callback(result);
          }
      });
    });
}

function getMessageByID (taskID, callback) {
    client.hgetall(taskID, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }
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

var redis = require("redis"),
    sub = redis.createClient(), msg_count = 0,
    pub = redis.createClient();

module.exports = {
    create: create,
    readAll: readAll,
    toggleCompletion: toggleCompletion,
    pub: redis.createClient(),
    sub: redis.createClient()
};

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

function sortByRankAndTime (taskObj) {
    return taskObj.rank + "." + taskObj.time;
}

function insertIntoPrimaryList (obj, response) {
    insertIntoList("primary-list", sortByRankAndTime, obj, function (err, result) {

        if (err) {
            console.log(err);
        } else {
            response(result);
        }
    });
}



function create (request, reply) {
    var time = new Date().getTime();

    client.select(0, function() {
      increment("task-count", function (err, number) {

          if (err) {
              console.log(err);
          } else {
              var taskObj = {
                  task: request.payload.task,
                  complete: false,
                  time: time,
                  rank: request.payload.rank,
                  taskID: number
              };

              addToHash(number, taskObj, function (err, result) {

                  if (err) {
                      console.log(err);
                  } else {
                      insertIntoPrimaryList(taskObj, reply);
                  }
              });
          }
      });
    });
}

module.exports = {
    create: create,
    sortByRankAndTime: sortByRankAndTime
};

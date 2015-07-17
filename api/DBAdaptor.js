function insertIntoList (client, list, obj, callback) {
    client.zadd(list, obj.time, obj.taskID, function (err, result) {

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

function create (client, taskObj, callback) {

      client.incr("task-count", function (err, taskID) {

          if (err) {
              console.log(err);
          } else {
              var createTime = new Date().getTime();
              taskObj.time = createTime;
              taskObj.complete = "";
              taskObj.taskID = taskID;

              client.hmset(taskID, taskObj, function (err, result) {

                  if (err) {
                      console.log(err);
                  } else {
                      insertIntoList(client, "primary-list", taskObj, callback); //possible to add to multiple lists with different scoring systems
                  }
              });
          }
      });
}

function updateByTaskID (client, taskID, changeObj, callback) {
      client.hmset(taskID, changeObj, function(err, result) {
          if(!err) {
              callback(result); //if successful will be 0
          }
      });
}

function deleteByTaskID (client, taskID, callback) {
      client.zrem("primary-list", taskID, function(err, result) {
          if(!err) {
              callback(result); //if successful will be 0
          }
      });
}

function readAll(client, callback) {
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

}

module.exports = {
    create: create,
    readAll: readAll,
    updateByTaskID: updateByTaskID,
    deleteByTaskID: deleteByTaskID
};

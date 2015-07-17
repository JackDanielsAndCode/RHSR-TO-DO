var DB = require('../DBAdaptor.js');

module.exports = function taskHandler (io, pub) {

  io.on('connection', function (socket) {
      console.log("client connected");

      socket.on("create-task", function (data) {

          DB.create(pub, data, function (result) {

              if (result.success) {
                  pub.publish("task-created", JSON.stringify(result.taskObj));
              }
          });
      });
      socket.on("update-task", function (updateObj) {

          DB.updateByTaskID(pub, updateObj.taskID, updateObj, function (result) {
              pub.publish("task-updated", JSON.stringify(updateObj));
          });
      });
      socket.on("delete-task", function (taskID) {

          DB.deleteByTaskID(pub, taskID, function (result) {
              // if result good?
              pub.publish("task-deleted",taskID);
          });
      });
  });
};

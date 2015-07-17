<to-do>
    <new-task socket={ socket }></new-task>
    <h1>Your Tasks</h1>
    <task-list items={ taskItems } socket={ socket }></task-list>

    <script>
        this.taskItems = [];
        var socket = this.socket = io();
        var todo = this;

        this.on('mount', function(){
          var xhr = new XMLHttpRequest();
          xhr.open('GET', '/getTasks');
          xhr.send();
          xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                  todo.taskItems = JSON.parse(xhr.responseText);
                  todo.update()
              }
          };
        });


        socket.on("task-updated", function (unparsedObj) {
            var updateObj=JSON.parse(unparsedObj);

            todo.taskItems.map( function(e) {

                if (e.taskID === updateObj.taskID ) {
                    for (var key in updateObj) {
                        e[key]=updateObj[key];
                    }
                }
                return e;
            })
            todo.update();
        });

        socket.on("task-deleted", function (taskID)  {
            var i;
            var taskCount= todo.taskItems.length;

            for (i=0; i<taskCount; i++) {
                if ( todo.taskItems[i].taskID.toString() === taskID ) {
                    todo.taskItems.splice(i,1);
                    return todo.update();
                }
            }
        });

        socket.on("task-created", function(unparsedObj) {
            var taskObj=JSON.parse(unparsedObj);
            todo.taskItems.push(taskObj);
            todo.update();
        });
    </script>
</to-do>

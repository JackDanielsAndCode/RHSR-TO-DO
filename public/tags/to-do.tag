<to-do>
    <new-task></new-task>
    <h1>Your Tasks</h1>
    <task-list items={ taskItems } ></task-list>

    <script>
        this.taskItems = [];
        var socket = this.socket = io();
        var todo = this;

        this.on('mount', function(){
          console.log('Riot mount event fired');
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


        socket.on("task-update", function (updateObj) {

            todo.taskItems.map( function(e) {

                if (e.taskID === updateObj.taskID ) {
                    console.log(e,updateObj,"change");
                    for (var key in updateObj) {
                        e[key]=updateObj[key];
                    }
                }
                return e;
            })

            todo.update();
        });

        socket.on("task-deletion", function (taskID)  {
            console.log(todo.taskItems);
            var i;
            var taskCount= todo.taskItems.length;

            for (i=0; i<taskCount; i++) {
                if ( todo.taskItems[i].taskID === taskID ) {
                    break;
                }
            }

            todo.taskItems.splice(i,1);
            console.log(todo.taskItems)
            todo.update();

        });

        socket.on("new-task", function(taskObj) {
            todo.taskItems.push(taskObj);
            todo.update();
        });
    </script>
</to-do>

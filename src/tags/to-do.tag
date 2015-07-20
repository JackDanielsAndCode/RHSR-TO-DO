<to-do>
    <user-list users={ users }></user-list>
    <h1>Realtime To Do App</h1>
    <new-task socket={ socket } name={ name }></new-task>
    <h2>Your Tasks</h2>
    <task-list items={ taskItems } socket={ socket } name={ name }></task-list>

    <script>



        function getName () {
        // prompt for person's name before allowing to post
            var name = "jack"
            socket.emit('new-user', name);
            return name;
        }

        this.taskItems = opts.taskItems;
        this.users= [];
        var socket = this.socket = io();
        var todo = this;
        this.name = getName();



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

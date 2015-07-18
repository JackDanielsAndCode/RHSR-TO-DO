<to-do>
    <user-list users={ users }></user-list>
    <h1>Realtime To Do App</h1>
    <new-task socket={ socket } name={ name }></new-task>
    <h2>Your Tasks</h2>
    <task-list items={ taskItems } socket={ socket } name={ name }></task-list>

    <script>

        function getCookieByname (name) {
            if (!name) { return null; }
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        }

        function getName () {
        // prompt for person's name before allowing to post
            var name = getCookieByname("realtimetodoname");
            if(!name) {
                name = window.prompt("What is your name/handle?");
                window.document.cookie='realtimetodoname='+name;
            }
            socket.emit('new-user', name);
            return name;
        }

        function initialTaskUpdate (callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/getTasksAndUsers');
            xhr.send();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    todo.taskItems = JSON.parse(xhr.responseText);
                    callback();
                }
            };
        }

        this.taskItems = [];
        this.users= [];
        var socket = this.socket = io();
        var todo = this;
        this.name = getName();

        this.on('mount', function(){
            initialTaskUpdate( function () {
                todo.update();
            })
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

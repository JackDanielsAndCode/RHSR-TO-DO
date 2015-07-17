riot.tag('delete-check', '<div> <p>{opts.message}<p> <button onclick="{ opts.yes }">yes</button> <button onclick="{ opts.no }" >no</button> <div>', function(opts) {


});

riot.tag('new-task', '<form onsubmit="{ add }"> <input name="input" onkeyup="{ edit }"> <button __disabled="{ !text }">Add</button> </form>', function(opts) {
        this.disabled = true

        this.edit = function(e) {
            this.text = e.target.value
        }.bind(this);

        this.add = function(e) {
            if (this.text) {
                var taskObj = {
                    task: this.text
                }
                opts.socket.emit("create-task", taskObj);
                this.text = this.input.value = ''
            }
        }.bind(this);

    
});

riot.tag('task-list', '<task each="{el in opts.items}" item="{ el }" ></task>', function(opts) {
      this.socket = opts.socket;
  
});

riot.tag('task', '<div class="{task-flash:true}"> <label> <input type="checkbox" __checked="{ opts.item.complete }" onclick="{ toggle }"> <p hide="{ editable }" class="{ strike-through:opts.item.complete }">{ opts.item.task }</p> <input name="taskEdit" onchange="{ editing }" onkeyup="{ editing }" type="text" show="{ editable }" value="{ tempValue }"> <button onclick="{ toggleEditable }" hide="{ editable }" >edit</button> <button onclick="{ toggleEditable }" show="{ editable }" >done</button> <button onclick="{ toggleDeletable }" hide="{ deletable }" >X</button> <div show="{ deletable }"> <p>{ deleteMessage }<p> <button onclick="{ deleteTask }">yes</button> <button onclick="{ toggleDeletable }" >no</button> <div> </label> </div>', function(opts) {
    var socket = this.parent.socket;
    var date = new Date(Number(opts.item.time));
    this.deleteMessage="Are you sure you want to delete this task created on: " + date;

    this.toggle = function() {
        var taskObj = {
            taskID: opts.item.taskID
        };
        taskObj.complete = opts.item.complete === "" ? new Date().getTime() : "";
        socket.emit("update-task", taskObj);
    }.bind(this);

    this.deletable=false;

    this.editable=false;

    this.toggleEditable = function() {
        this.editable = !this.editable;
        this.tempValue = opts.item.task;
    }.bind(this);

    this.toggleDeletable = function() {
        this.deletable = !this.deletable;
    }.bind(this);

    this.deleteTask = function() {
        socket.emit("delete-task", opts.item.taskID);
        this.toggleDeletable();
    }.bind(this);

    this.editing = function(e) {
        if (e.keyCode===13) {
          this.toggleEditable();
        }
        var taskObj = {
          taskID: opts.item.taskID,
          task: e.target.value
        };
        socket.emit("update-task", taskObj);

    }.bind(this);

    this.initialiseValue = function(e) {
        console.log(e);
        e.target.value=opts.item.task;
        console.log(this.parent.tags);
    }.bind(this);



    
});

riot.tag('to-do', '<new-task socket="{ socket }"></new-task> <h1>Your Tasks</h1> <task-list items="{ taskItems }" socket="{ socket }"></task-list>', function(opts) {
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
    
});

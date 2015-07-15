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
                this.parent.socket.emit("new-task", taskObj);
                this.text = this.input.value = ''
            }
        }.bind(this);

    
});

riot.tag('task-list', '<task each="{el in opts.items}" item="{el}" ></task>', function(opts) {

});

riot.tag('task', '<div class="task-flash"> <label> <input type="checkbox" __checked="{ opts.item.complete }" onclick="{ toggle }"> <p class="{hidden:editable, strike-through:opts.item.complete}">{opts.item.task}</p> <input name="taskEdit" type="text" class="{hidden:!editable}" value="{opts.item.task}"> <button onclick="{ toggleEditable }" class="{hidden:editable}" >edit</button> <button onclick="{ submitEdit }" class="{hidden:!editable}" >submit</button> <button onclick="{ deleteTask }" >X</button> </label> </div>', function(opts) {

      this.toggle = function() {
        var taskObj = {
            taskID: opts.item.taskID
        };
        taskObj.complete = opts.item.complete === "" ? new Date().getTime() : "";
        console.log(taskObj);
        this.parent.parent.parent.socket.emit("update-task", taskObj);
      }.bind(this);

      this.on("update", function(){
        console.log("updated:");
      })

        this.editable=false;

      this.toggleEditable = function() {
        this.editable = !this.editable;
      }.bind(this);

      this.deleteTask = function() {
          this.parent.parent.parent.socket.emit("delete-task", opts.item.taskID);
      }.bind(this);

      this.submitEdit = function() {
          this.toggleEditable();
          var taskObj = {
              taskID: opts.item.taskID
          };
          taskObj.task = this.taskEdit.value;
          this.parent.parent.parent.socket.emit("update-task", taskObj);
      }.bind(this);

    
});

riot.tag('to-do', '<new-task></new-task> <h1>Your Tasks</h1> <task-list items="{ taskItems }" ></task-list>', function(opts) {
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
            console.log(taskID);
            var i;
            var taskCount= todo.taskItems.length;
            console.log(taskCount);

            for (i=0; i<taskCount; i++) {
                if ( todo.taskItems[i].taskID === Number(taskID) ) {
                    todo.taskItems.splice(i,1);
                    return todo.update();
                }
            }



        });

        socket.on("new-task", function(taskObj) {
            todo.taskItems.push(taskObj);
            todo.update();
        });
    
});

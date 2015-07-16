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
                this.parent.socket.emit("new-task", taskObj);
                this.text = this.input.value = ''
            }
        }.bind(this);

    
});

riot.tag('task-list', '<task each="{el in opts.items}" item="{el}" ></task>', function(opts) {

});

riot.tag('task', '<div class="{task-flash:true}"> <label> <input type="checkbox" __checked="{ opts.item.complete }" onclick="{ toggle }"> <p class="{hidden:editable, strike-through:opts.item.complete}">{opts.item.task}</p> <input name="taskEdit" onchange="{ editing }" onkeyup="{ editing }" type="text" class="{hidden:!editable}" value="{opts.item.task}"> <button onclick="{ toggleEditable }" class="{hidden:editable}" >edit</button> <button onclick="{ toggleEditable }" class="{hidden:!editable}" >done</button> <button onclick="{ toggleDeletable }" class="{hidden:deletable}" >X</button> <delete-check class="{hidden:!deletable}" no="{ toggleDeletable }" yes="{ deleteTask }" message="{ deleteMessage }" > </delete-check> </label> </div>', function(opts) {
    var date= new Date(Number(opts.item.time));
    console.log(opts.item.time);
    this.deleteMessage="Are you sure you want to delete this task created on: " + date;

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


      this.deletable=false;

      this.editable=false;

      this.toggleEditable = function() {
        this.editable = !this.editable;
      }.bind(this);

      this.toggleDeletable = function() {
        this.deletable = !this.deletable;
      }.bind(this);

      this.deleteTask = function() {
          this.parent.parent.parent.socket.emit("delete-task", opts.item.taskID);
          this.toggleDeletable();
      }.bind(this);

      this.editing = function(e) {
          if (e.keyCode===13) {
              this.toggleEditable();
          } else {
              var taskObj = {
                  taskID: opts.item.taskID,
                  task: e.target.value
              };
              this.parent.parent.parent.socket.emit("update-task", taskObj);
          }
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
                    for (var key in updateObj) {
                        e[key]=updateObj[key];
                    }
                }
                return e;
            })

            todo.update();
        });

        socket.on("task-deletion", function (taskID)  {
            var i;
            var taskCount= todo.taskItems.length;

            for (i=0; i<taskCount; i++) {
                if ( todo.taskItems[i].taskID.toString() === taskID ) {
                    todo.taskItems.splice(i,1);
                    return todo.update();
                }
            }



        });

        socket.on("new-task", function(taskObj) {
            console.log('new-task');
            todo.taskItems.push(taskObj);
            todo.update();
        });
    
});

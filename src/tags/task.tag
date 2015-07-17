<task>
    <div class={task-flash:true}>
        <label>
            <input type='checkbox' checked={ opts.item.complete } onclick={ toggle } />
            <p class={hidden:editable, strike-through:opts.item.complete}>{opts.item.task}</p>
            <input name="taskEdit" onchange={ editing } onkeyup={ editing } type='text' class={hidden:!editable} value={opts.item.task}>
            <button onclick={ toggleEditable } class={hidden:editable} >edit</button>
            <button onclick={ toggleEditable } class={hidden:!editable} >done</button>
            <button onclick={ toggleDeletable } class={hidden:deletable} >X</button>
            <div class={hidden:!deletable}>
                <p>{ deleteMessage }<p>
                <button onclick={ deleteTask }>yes</button>
                <button onclick={ toggleDeletable } >no</button>
            <div>
        </label>
    </div>
    <script>
    var socket = this.parent.socket;
    var date = new Date(Number(opts.item.time));
    this.deleteMessage="Are you sure you want to delete this task created on: " + date;

      toggle () {
        var taskObj = {
            taskID: opts.item.taskID
        };
        taskObj.complete = opts.item.complete === "" ? new Date().getTime() : "";
        socket.emit("update-task", taskObj);
      }

      this.deletable=false;

      this.editable=false;

      toggleEditable () {
        this.editable = !this.editable;
      }

      toggleDeletable () {
        this.deletable = !this.deletable;
      }

      deleteTask () {
          socket.emit("delete-task", opts.item.taskID);
          this.toggleDeletable();
      }

      editing (e) {
          if (e.keyCode===13) {
              this.toggleEditable();
          } else {
              var taskObj = {
                  taskID: opts.item.taskID,
                  task: e.target.value
              };
              socket.emit("update-task", taskObj);
          }
      }


    </script>
</task>

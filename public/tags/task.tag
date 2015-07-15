<task>
    <div class="task-flash">
        <label>
            <input type='checkbox' checked={ opts.item.complete } onclick={ toggle } />
            <p class={hidden:editable, strike-through:opts.item.complete}>{opts.item.task}</p>
            <input name="taskEdit" type='text' class={hidden:!editable} value={opts.item.task}>
            <button onclick={ toggleEditable } class={hidden:editable} >edit</button>
            <button onclick={ submitEdit } class={hidden:!editable} >submit</button>
            <button onclick={ deleteTask } >X</button>
        </label>
    </div>

    <script>

      toggle () {
        var taskObj = {
            taskID: opts.item.taskID
        };
        taskObj.complete = opts.item.complete === "" ? new Date().getTime() : "";
        console.log(taskObj);
        this.parent.parent.parent.socket.emit("update-task", taskObj);
      }

      this.on("update", function(){
        console.log("updated:");
      })

        this.editable=false;

      toggleEditable () {
        this.editable = !this.editable;
      }

      deleteTask () {
          this.parent.parent.parent.socket.emit("delete-task", opts.item.taskID);
      }

      submitEdit () {
          this.toggleEditable();
          var taskObj = {
              taskID: opts.item.taskID
          };
          taskObj.task = this.taskEdit.value;
          this.parent.parent.parent.socket.emit("update-task", taskObj);
      }

    </script>
</task>

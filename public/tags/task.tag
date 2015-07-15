<task>
    <div>
        <label>
            <input type='checkbox' checked={ opts.item.complete } onclick={ toggle } />{opts.item.task}
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
        console.log("updated:",opts.item.taskID);
      })

      deleteTask () {
        this.parent.parent.parent.socket.emit("delete-task", opts.item.taskID);
      }

    </script>
</task>

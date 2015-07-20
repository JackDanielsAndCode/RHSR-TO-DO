<task>
    <div class={task-flash:true}>
        <label>
            <input type='checkbox' checked={ opts.item.complete } onclick={ toggle } />
            <p hide={ editable } class={ strike-through:opts.item.complete }>{ opts.item.createdBy + ": " + opts.item.task }</p>
            <input name="taskEdit" onchange={ editing } onkeyup={ editing } type='text' show={ editable } value={ tempValue } />
            <button onclick={ toggleEditable  } hide={ editable } >edit</button>
            <button onclick={ toggleEditable } show={ editable } >done</button>
            <button onclick={ toggleDeletable } hide={ deletable } >X</button>
            <div show={ deletable }>
                <p>{ deleteMessage }</p>
                <button onclick={ deleteTask }>yes</button>
                <button onclick={ toggleDeletable } >no</button>
            </div>
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
        this.tempValue = opts.item.task;
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
        }
        var taskObj = {
          taskID: opts.item.taskID,
          task: e.target.value
        };
        socket.emit("update-task", taskObj);

    }

    initialiseValue (e) {
        console.log(e);
        e.target.value=opts.item.task;
        console.log(this.parent.tags);
    }



    </script>
</task>

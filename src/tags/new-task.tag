<new-task>
    <form onsubmit={ add }>
        <input name="input" onkeyup={ edit }>
        <button disabled={ !text }>Add</button>
    </form>
    <script>

        this.name=opts.name;
        console.log(this.name);
        this.disabled = true

        edit(e) {
            this.text = e.target.value
        }

        add(e) {
            if (this.text) {
                var taskObj = {
                    task: this.text,
                    createdBy: this.name,
                    lasteditedBy: this.name
                }
                opts.socket.emit("create-task", taskObj);
                this.text = this.input.value = ''
            }
        }

    </script>
</new-task>

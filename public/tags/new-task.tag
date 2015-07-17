<new-task>
    <form onsubmit={ add }>
        <input name="input" onkeyup={ edit }>
        <button disabled={ !text }>Add</button>
    </form>
    <script>
        this.disabled = true

        edit(e) {
            this.text = e.target.value
        }

        add(e) {
            if (this.text) {
                var taskObj = {
                    task: this.text
                }
                this.parent.socket.emit("create-task", taskObj);
                this.text = this.input.value = ''
            }
        }

    </script>
</new-task>

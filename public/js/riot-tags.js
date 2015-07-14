riot.tag('task-list', '<h1>Your Tasks</h1> <task each="{task in opts.items}"></task>', function(opts) {
    this.on('mount', function(){
      console.log('Riot mount event fired');
      opts.loadCallback(this);
    });

    this.on('data-loaded', function(data){
      opts.items = JSON.parse(data);
      this.update();
    });

    this.on('new-task', function(data){
      opts.items.push(data);
      this.update();
    })
  
});

riot.tag('task', '<div> <input type="checkbox" onclick="completionToggle({parent.task.taskID},{parent.task.complete})"></input> <p>{parent.task.task}</p> </div>', function(opts) {

});

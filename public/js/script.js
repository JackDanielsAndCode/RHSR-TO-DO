var socket=io();
var taskBox = document.querySelectorAll('input[name="task"]')[0];
var taskButton = document.querySelectorAll('button[name="button"]')[0];

socket.on("new-task", function(taskObj) {
    console.log(taskObj);
});

socket.on("completion-update", function (id) {
    console.log("id",id);
});

var xhr = new XMLHttpRequest();
xhr.open('GET', '/getTasks');
xhr.send();
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        displayTasks(xhr.responseText);
    }
};

function displayTasks (data) {
    console.log(data);
}

taskButton.onclick = function () {
    taskObj = {
        task: taskBox.value
    };
    socket.emit("new-task", taskObj);
    taskBox.value="";
};

function completionToggle (ID, status) {
    socket.emit("completion-change", {
        ID:ID,
        status:status
    });
}

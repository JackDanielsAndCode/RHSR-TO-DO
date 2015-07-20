 var init = require("./init.js");
 var riot = require("riot");
 io       = require("socket.io");

 require("./../src/tags/to-do.tag");
 require("./../src/tags/new-task.tag");
 require("./../src/tags/task-list.tag");
 require("./../src/tags/task.tag");

 var routes = [
    {
        method: 'GET',
        path:'/{path*}',
        handler: {
            directory: {
                path: './public'
            }
        }
    },
    {
        method: 'GET',
        path: "/",
        handler: function (request, reply) {
            init.loadExistingHandler(function (result) {
                var todo = riot.render("to-do", {
                    taskItems: result,
                });
                reply('<html><head><meta charset="utf-8"><title></title><link rel="stylesheet" href="./css/main.css" charset="utf-8"></head><body>'+todo+'<script src="https://cdn.socket.io/socket.io-1.3.5.js"></script><script src="./lib/riot.min.js"></script><script src="./js/riot-tags.js"></script></body></html>');
            });
        }
    }
];

module.exports = routes;

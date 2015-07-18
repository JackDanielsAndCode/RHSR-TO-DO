 var init = require("./init.js");
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
        path: "/getTasksAndUsers",
        handler: function (request, reply) {
            init.loadExistingHandler(function (result) {
                reply(result);
            });
        }
    }
];

module.exports = routes;

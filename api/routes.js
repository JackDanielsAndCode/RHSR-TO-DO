 var init = require("./init.js");
 var routes = [
    {
      method: 'GET',
      path: "/",
      config: {
          handler: function(request, reply){
              reply.view('index');
            }
        }
    },
    {
      method: 'GET',
      path: "/getTasks",
      handler: function (request, reply) {
          init.loadExistingHandler(function(result){
              reply(result);
          });
      }
    },
    {
        method: 'GET',
        path: '/public/{path*}',
        handler: {
            directory: {
                path: './public'
            }
        }
    }
];

module.exports = routes;

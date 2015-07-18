 var init = require("./init.js");
 var routes = [
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
        path: '/{path*}',
        handler: {
            directory: {
                path: './public'
            }
        }
    }
];

module.exports = routes;

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
          require("./handlers/DBAdaptor").readAll(function(result){
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

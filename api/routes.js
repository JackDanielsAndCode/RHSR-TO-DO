 var routes = [
    {
      method: 'POST',
      path: "/create",
      handler: require("./handlers/create.js").create
    },
];

module.exports = routes;

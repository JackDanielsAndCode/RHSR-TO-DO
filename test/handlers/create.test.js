var test    = require("tape");
var server  = require("../../api/server.js");
var creator = require("../../api/handlers/create.js");

test("create handler", function (t) {
    var options = {
        method: "POST",
        url: "/create",
        payload: {
            task: "implement redis",
            rank: 4
        }
    };

    server.inject(options, function (response) {
        t.equal(response.result, 1, "successfully added as a hash to redis db but also to primary task list and increment the task number by 1");
        t.end();
    });
});

test("sort by rank and time function", function (t) {
    var testObj= {
        time: 12345678,
        rank: 2
    };

    t.equal(creator.sortByRankAndTime(testObj), "2.12345678", "from rank and time correct score produced as a string");
    t.end();
});

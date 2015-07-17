# TODO APP

## What is this?

A to do app built with Redis, Hapi.js, Riot.js and Socket.io.

See it live. https://realtimetodo.herokuapp.com


### TODO Functionality

* A to do list ordered by time.
* On task creation flashing green light appending task to bottom of the list.
* Real time task content editing for all users to see.
* Completion checkbox with strike-through.
* Two step deletion button.


### Pub/Sub & Socket.io

On the creation/update/deletion of a task the clients socket emits to its server. The socket on the server then receives this message and a redis pub client publishes this to all subscribed servers each sharing the same redis database. These then emit the message with their socket and clients receive it with theres. This is the only time that riots dom is updated. So there are three layers with Redis acting as the message broker. This app can be therefore scaled to have many servers all working together.


### How is the data stored?

Each message is stored as a hash in Redis with a unique id formed by creating a count of all the tasks ever created and a one to one mapping (Redis increment command very useful here).

Each id is then stored in an ordered set by time and with this list one can find all the ids and then find the message objects themselves.

## How to run this project

Running this project requires Node.js and a basic knowledge of using git and the command line.

### 1. Clone this repo

``` git clone https://github.com/jrans/redis-riot-reading  ```

### 2. Install dependencies

Make sure you're in the right folder, and run ```npm install```

### 3. Redis

You need a config.json in the root of your directory. Here is an example of ours.

```
{
    "redisUrl": "redis://localhost:6379",
    "dbNumber": "1"
}
```


You can choose to have a local redis database, or a remote one. You will need a redis url note the above is for the typical local redis db server. Install redis and run redis-server if you want a local one.

### 4. Start the server

Run ```npm start```, and point your browser to *localhost:8000*.

### 5. Developing

Run ```npm run dev```, and point your browser to *localhost:8000*.

For Riot: This will watch your tags folder and compile them into public/js/riot-tags.js.

For majority of changes: Nodemon will watch files and restart the server.

/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
"use strict";
var express = require("express"),
    app = express(),
    http = require("http").Server(app),
    io = require("socket.io")(http),
    bodyParser = require("body-parser"),
    toDos = [
        {
            "description": "Get groceries",
            "tags": ["shopping", "chores"]
        },
        {
            "description": "Make up some new ToDos",
            "tags": ["writing", "work"]
        },
        {
            "description": "Prep for Monday's class",
            "tags": ["work", "teaching"]
        },
        {
            "description": "Answer emails",
            "tags": ["work"]
        },
        {
            "description": "Take Gracie to the park",
            "tags": ["chores", "pets"]
        },
        {
            "description": "Finish writing this book",
            "tags": ["writing", "work"]
        }
    ];

app.use(express.static(__dirname + "/client"));

// tell Express to parse incoming
// JSON objects
app.use(bodyParser.urlencoded({extended: false}));

http.listen(3000, function () {
    console.log("3000");
});
io.on("connection", function (socket) {
    socket.emit("setToDos", toDos);
    socket.on("updateToDos", function (newToDo) {
        toDos.push(newToDo);
        io.emit("setToDos", toDos);
    });
});

/*
 // This route takes the place of our
 // todos.json file in our example from
 // Chapter 5
 app.get("/todos.json", function (req, res) {
 res.json(toDos);
 });

 app.post("/todos", function (req, res) {
 // the object is now stored in req.body
 var newToDo = req.body;

 console.log(newToDo);

 toDos.push(newToDo);

 // send back a simple object
 res.json({"message":"You posted to the server!"});
 });*/

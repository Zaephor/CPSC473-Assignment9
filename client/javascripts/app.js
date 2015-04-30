/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
var toDoObjects;
var socket;
var main = function () {
    "use strict";
    socket = io();
    // get To Do objects from server
    socket.on("setToDos", function (toDoObjectsFromServer) {
        toDoObjects = toDoObjectsFromServer;
        //console.log(toDoObjects);
        main2();
    });
};

var main2 = function () {
    "use strict";

    var toDos = toDoObjects.map(function (toDo) {
        // we'll just return the description
        // of this toDoObject
        return toDo.description;
    });

    $(".tabs a span").toArray().forEach(function (element) {
        var $element = $(element);

        // create a click handler for this element
        $element.on("click", function (event) {
            event.preventDefault();
            var $content,
                $input,
                $button,
                i;

            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            if ($element.parent().is(":nth-child(1)")) {
                $content = $("<ul>");
                for (i = toDos.length - 1; i >= 0; i--) {
                    $content.append($("<li>").text(toDos[i]));
                }
            } else if ($element.parent().is(":nth-child(2)")) {
                $content = $("<ul>");
                toDos.forEach(function (todo) {
                    $content.append($("<li>").text(todo));
                });
            } else if ($element.parent().is(":nth-child(3)")) {
                var tags = [];

                toDoObjects.forEach(function (toDo) {
                    toDo.tags.forEach(function (tag) {
                        if (tags.indexOf(tag) === -1) {
                            tags.push(tag);
                        }
                    });
                });
                console.log(tags);

                var tagObjects = tags.map(function (tag) {
                    var toDosWithTag = [];

                    toDoObjects.forEach(function (toDo) {
                        if (toDo.tags.indexOf(tag) !== -1) {
                            toDosWithTag.push(toDo.description);
                        }
                    });

                    return {"name": tag, "toDos": toDosWithTag};
                });

                tagObjects.forEach(function (tag) {
                    var $tagName = $("<h3>").text(tag.name),
                        $content = $("<ul>");


                    tag.toDos.forEach(function (description) {
                        var $li = $("<li>").text(description);
                        $content.append($li);
                    });

                    $("main .content").append($tagName);
                    $("main .content").append($content);
                });
            } else if ($element.parent().is(":nth-child(4)")) {
                var $input = $("<input>").addClass("description"),
                    $inputLabel = $("<p>").text("Description: "),
                    $tagInput = $("<input>").addClass("tags"),
                    $tagLabel = $("<p>").text("Tags: "),
                    $button = $("<button>").text("+");

                $button.on("click", function (event) {
                    event.preventDefault();
                    var description = $input.val(),
                        tags = $tagInput.val().split(","),
                    // create the new to-do item
                        newToDo = {"description": description, "tags": tags};

                    toDoObjects.push({"description": description, "tags": tags});
                    /*
                     // here we'll do a quick post to our todos route
                     $.post("todos", newToDo, function (response) {
                     console.log("We posted and the server responded!");
                     console.log(response);
                     });

                     // update toDos
                     toDos = toDoObjects.map(function (toDo) {
                     return toDo.description;
                     });*/
                    socket.emit("updateToDos", newToDo);

                    $input.val("");
                    $tagInput.val("");
                });

                $content = $("<div>").append($inputLabel)
                    .append($input)
                    .append($tagLabel)
                    .append($tagInput)
                    .append($button);
            }

            $("main .content").append($content);

            return false;
        });
    });

//    $(".tabs a:first-child span").trigger("click");
    $(".tabs a span.active").trigger("click");
};
/*
 $(document).ready(function () {
 $.getJSON("todos.json", function (toDoObjects) {
 main(toDoObjects);
 });
 });*/
$(document).ready(main());

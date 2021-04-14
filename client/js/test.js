var toDoObjects = [
    {
    "description" : "Сделать покупки",
    "tags" : [ "шопинг", "рутина" ]
    },
    {
    "description" : "Сделать несколько новых задач",
    "tags" : [ "писательство", "работа" ]
    },
    /* etc */
];
var organizeByTags = function (toDoObjects) {
    console.log("organizeByTags вызвана");
};
var main = function () {
    "use strict";
    var organizeByTags = function () {
    console.log("organizeByTags вызвана");
    };
    organizeByTags(toDoObjects);
};
$(document).ready(main); 
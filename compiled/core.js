// 2D Canvas Setup
var canvasElement = document.getElementById("main");
var canvas = canvasElement.getContext("2d");
/** Contains all the Primitive Shapes currently drawn on the Canvas */
var canvasManager = [];
/** Contains all the Complex Shapes currently drawn on the Canvas */
var eventManager = [];
/** Clears the Canvas and redraws all elements in the ```canvasManager``` array. */
function requestRedraw() {
    canvas.clearRect(0, 0, canvasElement.width, canvasElement.height); // clear the canvas
    for (var _i = 0, canvasManager_1 = canvasManager; _i < canvasManager_1.length; _i++) {
        var canvasItem = canvasManager_1[_i];
        if (canvasItem) {
            canvasItem.draw(); // call draw() on each canvas item
        }
    }
}
// console.log("CORE.TS LOADED");

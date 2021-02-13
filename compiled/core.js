var canvasElement = document.getElementById("main");
var canvas = canvasElement.getContext("2d");
var canvasManager = [];
function requestRedraw() {
    canvas.clearRect(0, 0, canvasElement.width, canvasElement.height);
    for (var _i = 0, canvasManager_1 = canvasManager; _i < canvasManager_1.length; _i++) {
        var canvasItem = canvasManager_1[_i];
        if (canvasItem) {
            canvasItem.draw();
        }
    }
}
var eventManager = [];
console.log("CORE.TS LOADED");

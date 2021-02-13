var Coordinate = /** @class */ (function () {
    function Coordinate(x, y) {
        this.x = x;
        this.y = y;
    }
    return Coordinate;
}());
function getRealCoordinates(ev) {
    var el = canvasElement.getBoundingClientRect();
    var rx = ev.clientX - el.left;
    var ry = ev.clientY - el.top;
    return new Coordinate(rx, ry);
}
canvasElement.addEventListener("click", function (ev) {
    var mouse = getRealCoordinates(ev);
});
canvasElement.addEventListener("mousedown", function (ev) {
    var mouse = getRealCoordinates(ev);
    for (var _i = 0, eventManager_1 = eventManager; _i < eventManager_1.length; _i++) {
        var EObject = eventManager_1[_i];
        if (EObject && EObject.isInside(mouse.x, mouse.y)) {
            EObject.mousedown(mouse.x, mouse.y);
            return;
        }
    }
});
canvasElement.addEventListener("mousemove", function (ev) {
    var mouse = getRealCoordinates(ev);
    if (DRAGGING) {
        eventManager[DRAGGING_EVENT_HANDLE].mousemove(mouse.x, mouse.y);
    }
    else if (DRAWING) {
        eventManager[DRAWING_EVENT_HANDLE].mousemove(mouse.x, mouse.y);
    }
});
canvasElement.addEventListener("mouseup", function (ev) {
    var mouse = getRealCoordinates(ev);
    if (DRAGGING) {
        eventManager[DRAGGING_EVENT_HANDLE].mouseup(mouse.x, mouse.y);
    }
    else if (DRAWING) {
        eventManager[DRAWING_EVENT_HANDLE].mouseup(mouse.x, mouse.y);
    }
});
// test
var F = new CSection(0, 0, 3, true);
var G = new CSection(300, 300, 3, true);
var K = new CLink(canvasManager[F.sink[1]].x + 5, canvasManager[F.sink[1]].y + 5, canvasManager[G.source].x + 5, canvasManager[G.source].y + 5, F.sink[1]);
K.storyLink.to = G.source;

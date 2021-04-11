var Coordinate = (function () {
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
function openCorrespondingForm(eventHandle) {
    var obj = eventManager[eventHandle];
    if (obj instanceof CSection) {
        fillCSectionForm(obj);
    }
    else if (obj instanceof CLink) {
        fillCLinkForm(obj);
    }
}
CSectionForm.addEventListener("submit", function (ev) {
    ev.preventDefault();
    saveCSectionForm();
});
CLinkForm.addEventListener("submit", function (ev) {
    ev.preventDefault();
    saveCLinkForm();
});
metaForm.addEventListener("submit", function (ev) {
    ev.preventDefault();
    generateJson();
});
canvasElement.addEventListener("click", function (ev) {
    var mouse = getRealCoordinates(ev);
    for (var _i = 0, eventManager_1 = eventManager; _i < eventManager_1.length; _i++) {
        var EObject = eventManager_1[_i];
        if (EObject && EObject.isInside(mouse.x, mouse.y)) {
            console.log("selected handle: " + SELECTED_HANDLE);
            if (SELECTED_HANDLE !== -1) {
                if (eventManager[SELECTED_HANDLE] == null) {
                    SELECTED_HANDLE = -1;
                    return;
                }
                canvasManager[eventManager[SELECTED_HANDLE].base].color = RESET_COLOR;
            }
            SELECTED_HANDLE = EObject.eventId;
            RESET_COLOR = canvasManager[eventManager[SELECTED_HANDLE].base].color;
            canvasManager[eventManager[SELECTED_HANDLE].base].color = Color.Red;
            openCorrespondingForm(SELECTED_HANDLE);
            return;
        }
    }
    if (SELECTED_HANDLE !== -1) {
        if (eventManager[SELECTED_HANDLE] != null)
            canvasManager[eventManager[SELECTED_HANDLE].base].color = RESET_COLOR;
        SELECTED_HANDLE = -1;
        CSectionForm.style.display = "none";
        CLinkForm.style.display = "none";
    }
});
canvasElement.addEventListener("contextmenu", function (ev) {
    var mouse = getRealCoordinates(ev);
    ev.preventDefault();
    for (var _i = 0, eventManager_2 = eventManager; _i < eventManager_2.length; _i++) {
        var EObject = eventManager_2[_i];
        if (EObject && EObject.isInside(mouse.x, mouse.y)) {
            EObject.destroy();
            return;
        }
    }
});
canvasElement.addEventListener("mousedown", function (ev) {
    var mouse = getRealCoordinates(ev);
    for (var _i = 0, eventManager_3 = eventManager; _i < eventManager_3.length; _i++) {
        var EObject = eventManager_3[_i];
        if (EObject && EObject.isInside(mouse.x, mouse.y)) {
            EObject.mousedown(mouse.x, mouse.y);
            return;
        }
    }
    DRAGGING_CANVAS = true;
    DRAG_HOLD_OFFSET_X = mouse.x;
    DRAG_HOLD_OFFSET_Y = mouse.y;
});
canvasElement.addEventListener("mousemove", function (ev) {
    var mouse = getRealCoordinates(ev);
    if (DRAGGING_CANVAS) {
        var diffX = mouse.x - DRAG_HOLD_OFFSET_X;
        var diffY = mouse.y - DRAG_HOLD_OFFSET_Y;
        DRAG_HOLD_OFFSET_X = mouse.x;
        DRAG_HOLD_OFFSET_Y = mouse.y;
        for (var _i = 0, eventManager_4 = eventManager; _i < eventManager_4.length; _i++) {
            var EObject = eventManager_4[_i];
            if (EObject instanceof CSection) {
                EObject.x += diffX;
                EObject.y += diffY;
            }
        }
        return;
    }
    if (DRAGGING) {
        eventManager[DRAGGING_EVENT_HANDLE].mousemove(mouse.x, mouse.y);
    }
    else if (DRAWING) {
        eventManager[DRAWING_EVENT_HANDLE].mousemove(mouse.x, mouse.y);
    }
});
canvasElement.addEventListener("mouseup", function (ev) {
    var mouse = getRealCoordinates(ev);
    if (DRAGGING_CANVAS) {
        DRAGGING_CANVAS = false;
        return;
    }
    if (DRAGGING) {
        eventManager[DRAGGING_EVENT_HANDLE].mouseup(mouse.x, mouse.y);
    }
    else if (DRAWING) {
        eventManager[DRAWING_EVENT_HANDLE].mouseup(mouse.x, mouse.y);
    }
});
var btn = document.getElementById("newSection");
btn.addEventListener("click", function () {
    var temp = new CSection(0, 0, 3, true);
});
CSectionForm.style.display = "none";
CLinkForm.style.display = "none";

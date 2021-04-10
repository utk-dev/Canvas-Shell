class Coordinate {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

function getRealCoordinates(ev: MouseEvent): Coordinate {
    let el: DOMRect = canvasElement.getBoundingClientRect();
    let rx: number = ev.clientX - el.left;
    let ry: number = ev.clientY - el.top;
    return new Coordinate(rx, ry);
}

function openCorrespondingForm(eventHandle: number): void {
    let obj = eventManager[eventHandle];
    if (obj instanceof CSection) {
        fillCSectionForm(obj);
    } else if (obj instanceof CLink) {
        fillCLinkForm(obj);
    }
}

CSectionForm.addEventListener("submit", function (ev: Event) {
    ev.preventDefault();
    saveCSectionForm();
});

CLinkForm.addEventListener("submit", function (ev: Event) {
    ev.preventDefault();
    saveCLinkForm();
});

metaForm.addEventListener("submit", function (ev: Event) {
    ev.preventDefault();
    generateJson();
});

canvasElement.addEventListener("click", function(ev: MouseEvent) {
    let mouse: Coordinate = getRealCoordinates(ev);
    for (let EObject of eventManager) {
        if (EObject && EObject.isInside(mouse.x, mouse.y)) {
            console.log(`selected handle: ${SELECTED_HANDLE}`);
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

canvasElement.addEventListener("contextmenu", function(ev: MouseEvent) {
    let mouse: Coordinate = getRealCoordinates(ev);
    ev.preventDefault();
    for (let EObject of eventManager) {
        if (EObject && EObject.isInside(mouse.x, mouse.y)) {
            EObject.destroy();
            return;
        }
    }
});

canvasElement.addEventListener("mousedown", function(ev: MouseEvent) {
    let mouse: Coordinate = getRealCoordinates(ev);
    for (let EObject of eventManager) {
        if (EObject && EObject.isInside(mouse.x, mouse.y)) {
            EObject.mousedown(mouse.x, mouse.y);
            return;
        }
    }
    // else we are supposed to drag the canvas
    DRAGGING_CANVAS = true;
    DRAG_HOLD_OFFSET_X = mouse.x;
    DRAG_HOLD_OFFSET_Y = mouse.y;
});

canvasElement.addEventListener("mousemove", function(ev: MouseEvent) {
    let mouse: Coordinate = getRealCoordinates(ev);
    if (DRAGGING_CANVAS) {
        let diffX: number = mouse.x - DRAG_HOLD_OFFSET_X;
        let diffY: number = mouse.y - DRAG_HOLD_OFFSET_Y;
        DRAG_HOLD_OFFSET_X = mouse.x;
        DRAG_HOLD_OFFSET_Y = mouse.y;

        for (let EObject of eventManager) {
            if (EObject instanceof CSection) {
                // Moving a CSection automatically moves the lines attached to it.
                EObject.x += diffX;
                EObject.y += diffY;
            }
        }
        return;
    }
    if (DRAGGING) {
        eventManager[DRAGGING_EVENT_HANDLE].mousemove(mouse.x, mouse.y);
    } else if (DRAWING) {
        eventManager[DRAWING_EVENT_HANDLE].mousemove(mouse.x, mouse.y);
    }
});

canvasElement.addEventListener("mouseup", function(ev: MouseEvent) {
    let mouse: Coordinate = getRealCoordinates(ev);
    if (DRAGGING_CANVAS) {
        DRAGGING_CANVAS = false;
        return;
    }
    if (DRAGGING) {
        eventManager[DRAGGING_EVENT_HANDLE].mouseup(mouse.x, mouse.y);
    } else if (DRAWING) {
        eventManager[DRAWING_EVENT_HANDLE].mouseup(mouse.x, mouse.y);
    }
});


let btn: HTMLButtonElement = <HTMLButtonElement> document.getElementById("newSection");
btn.addEventListener("click", function() {
    let temp: CSection = new CSection(0, 0, 3, true);
});


CSectionForm.style.display = "none";
CLinkForm.style.display = "none";

// test
let F = new CSection(0, 0, 3, true);
let G = new CSection(300, 300, 3, true);
let K = new CLink(
    canvasManager[F.sink[1]].x+5,
    canvasManager[F.sink[1]].y+5,
    canvasManager[G.source].x+5,
    canvasManager[G.source].y+5,
    F.sink[1]
);

K.storyLink.to = G.source;

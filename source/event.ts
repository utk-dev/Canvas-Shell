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

canvasElement.addEventListener("click", function(ev: MouseEvent) {
    let mouse: Coordinate = getRealCoordinates(ev);
    for (let EObject of eventManager) {
        if (EObject && EObject.isInside(mouse.x, mouse.y)) {
            EObject.form();
            return;
        }
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
});

canvasElement.addEventListener("mousemove", function(ev: MouseEvent) {
    let mouse: Coordinate = getRealCoordinates(ev);

    if (DRAGGING) {
        eventManager[DRAGGING_EVENT_HANDLE].mousemove(mouse.x, mouse.y);
    } else if (DRAWING) {
        eventManager[DRAWING_EVENT_HANDLE].mousemove(mouse.x, mouse.y);
    }
});

canvasElement.addEventListener("mouseup", function(ev: MouseEvent) {
    let mouse: Coordinate = getRealCoordinates(ev);
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

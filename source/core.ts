// 2D Canvas Setup
let canvasElement: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("main");
let canvas: CanvasRenderingContext2D = canvasElement.getContext("2d");

/** Contains all the Primitive Shapes currently drawn on the Canvas */
let canvasManager: Array<any> = [];

/** Contains all the Complex Shapes currently drawn on the Canvas */
let eventManager: Array<any> = [];

/** Clears the Canvas and redraws all elements in the ```canvasManager``` array. */ 
function requestRedraw(): void {
    canvas.clearRect(0, 0, canvasElement.width, canvasElement.height);  // clear the canvas
    for (let canvasItem of canvasManager) {
        if (canvasItem) {
            canvasItem.draw();                                          // call draw() on each canvas item
        }
    }
}

// console.log("CORE.TS LOADED");
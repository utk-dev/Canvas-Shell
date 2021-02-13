let canvasElement: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("main");
let canvas: CanvasRenderingContext2D = canvasElement.getContext("2d");

let canvasManager: Array<any> = [];
function requestRedraw(): void {
    canvas.clearRect(0, 0, canvasElement.width, canvasElement.height);
    for (let canvasItem of canvasManager) {
        if (canvasItem) {
            canvasItem.draw();
        }
    }
}

let eventManager: Array<any> = [];

console.log("CORE.TS LOADED");
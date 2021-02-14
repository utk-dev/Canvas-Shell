let DRAWING: boolean = false;
let DRAWING_EVENT_HANDLE: number = -1;

let DRAGGING: boolean = false;
let DRAGGING_EVENT_HANDLE: number = -1;
let DRAG_HOLD_OFFSET_X: number = -1;
let DRAG_HOLD_OFFSET_Y: number = -1;

class CSection {
    private _x: number;
    private _y: number;
    public storySection: SSection;
    public base: number;
    public source: number;
    public sink: Array<number>;
    public eventId: number;

    constructor(x: number, y: number, no_of_sinks: number, has_source: boolean) {
        this._x = x;
        this._y = y;
        this.storySection = new SSection();
        this.base = (new PRect(x+10, y, 80, 100, Color.Green, Style.Fill)).hwnd;
        this.storySection.storyPos = this.base.toString();
        if (has_source) {
            this.source = (new PRect(x, y+45, 10, 10, Color.Blue, Style.Fill)).hwnd;
        } else {
            this.source = undefined;
        }

        this.sink = new Array<number>();
        this.updateSinkCount(no_of_sinks);

        this.eventId = eventManager.length;
        eventManager.push(this);
    }

    private updateSinkCount(sinkCount: number): void {
        this.sink = new Array<number>();
        let g: number = 100 / (sinkCount + 1);
        for (let i = 1; i <= sinkCount; i++) {
            this.sink.push((new PRect(this._x+90, this._y+g*i-5, 10, 10, Color.Blue, Style.Fill)).hwnd);
        }
    }

    private getLineToSyncWith(canvasHandle: number, end: string): number {
        for (let i = 0; i < eventManager.length; i++) {
            if (eventManager[i] && eventManager[i].storyLink) {
                let cond1: boolean = (end == "to" && eventManager[i].storyLink.to == canvasHandle);
                let cond2: boolean = (end == "from" && eventManager[i].storyLink.from == canvasHandle);
                if (cond1 || cond2)
                    return i;
            }
        }
        return null;
    }

    public set x(val: number) {
        let diff: number = val - this._x;
        this._x = val;
        canvasManager[this.base].x += diff;
        if (this.source) {
            let eHandle: number = this.getLineToSyncWith(this.source, "to");
            if (eHandle !== null) eventManager[eHandle].xt += diff;
            canvasManager[this.source].x += diff;
        }

        for (const sinkItem of this.sink) {
            let eHandle: number = this.getLineToSyncWith(sinkItem, "from");
            if (eHandle !== null) eventManager[eHandle].xf += diff;
            canvasManager[sinkItem].x += diff;
        }
    }

    public set y(val: number) {
        let diff: number = val - this._y;
        this._y = val;
        canvasManager[this.base].y += diff;
        if (this.source) {
            let eHandle: number = this.getLineToSyncWith(this.source, "to");
            if (eHandle !== null) eventManager[eHandle].yt += diff;  
            canvasManager[this.source].y += diff; 
        }
        for (const sinkItem of this.sink) {
            let eHandle: number = this.getLineToSyncWith(sinkItem, "from");
            if (eHandle !== null) eventManager[eHandle].yf += diff;
            canvasManager[sinkItem].y += diff;
        }
    }

    public set has_source(val: boolean) {
        if (val && this.source === undefined) {
            this.source = (new PRect(this._x, this._y+45, 10, 10, Color.Blue, Style.Fill)).hwnd;
        } else if (!val && this.source !== undefined) {
            let eHandle: number = this.getLineToSyncWith(this.source, "to");
            if (eHandle !== null) eventManager[eHandle].destroy();  // delete the link attached to this source
            canvasManager[this.source] = null;                      // delete the primitive from canvasManager
            requestRedraw();                                        // redraw the canvas
            this.source = undefined;                                // update the CSection object to sync changes
        }
    }

    public set no_of_sinks(val: number) {
        if (val !== this.sink.length) {
            for (const sinkItem of this.sink) {
                let eHandle: number = this.getLineToSyncWith(sinkItem, "from");
                if (eHandle !== null) eventManager[eHandle].destroy();
                canvasManager[sinkItem] = null;
            }
            this.updateSinkCount(val);
            requestRedraw();
        }
    }

    public get x(): number { return this._x; }
    public get y(): number { return this._y; }
    public get no_of_sinks(): number { return this.sink.length; }
    public get has_source(): boolean { return !!this.source; }

    public isInside(mx: number, my: number): boolean {
        return this._x <= mx && this._y <= my && mx <= this._x + 100 && my <= this._y + 100;
    }

    // events

    rightclick(mx: number, my: number) {
        this.destroy();
    }

    mousedown(mx: number, my: number) {
        if (!DRAGGING && canvasManager[this.base].isInside(mx, my)) {
            DRAGGING = true;
            DRAGGING_EVENT_HANDLE = this.eventId;
            DRAG_HOLD_OFFSET_X = mx - this.x;
            DRAG_HOLD_OFFSET_Y = my - this.y;
            return;
        }
        if (!DRAWING) {
            for (let sinkItem of this.sink) {
                let sinkObject: PRect = canvasManager[sinkItem];
                if (sinkObject.isInside(mx, my)) {
                    DRAWING_EVENT_HANDLE = (new CLink(sinkObject.x + 5, sinkObject.y + 5, mx, my, sinkItem)).eventId; 
                    console.log(DRAWING_EVENT_HANDLE);
                    DRAWING = true;
                    return;
                }
            }
        }
    }

    mousemove(mx: number, my: number) {
        if (DRAGGING && DRAGGING_EVENT_HANDLE == this.eventId) {
            this.x = mx - DRAG_HOLD_OFFSET_X; 
            this.y = my - DRAG_HOLD_OFFSET_Y;
        }
    } 

    mouseup(mx: number, my: number) {
        if (DRAGGING && DRAGGING_EVENT_HANDLE == this.eventId) {
            DRAGGING = false;
        }
    }

    form() {
        console.log(this.storySection);
    }

    destroy() {
        for (let EObject of eventManager) {
            if (EObject && EObject.storyLink && (this.sink.includes(EObject.storyLink.from) || this.sink.includes(EObject.storyLink.to))) {
                EObject.destroy();
            }
        }
        if (this.source) {
            let eHandle = this.getLineToSyncWith(this.source, "to");
            if (eHandle !== null) eventManager[eHandle].destroy();
        }
        eventManager[this.eventId] = null;
        canvasManager[this.source] = null;
        for (let CObject of this.sink) {
            canvasManager[CObject] = null;
        }
        canvasManager[this.base] = null;
        requestRedraw();
        if (canvasManager.every(elem => elem === null)) {
            canvasManager = [];
        }
        if (eventManager.every(elem => elem === null)) {
            eventManager = [];
        }
    }
}


class CLink {
    public base: number;
    public storyLink: SLink;
    public eventId: number;

    constructor(xf: number, yf: number, xt: number, yt: number, FromSink: number) {
        this.base = (new PLine(xf, yf, xt, yt, Color.Black)).hwnd;
        this.storyLink = new SLink();
        this.storyLink.from = FromSink;
        this.eventId = eventManager.length;
        eventManager.push(this);
    } 

    public destroy() {
        canvasManager[this.base] = null;
        this.storyLink = null;
        eventManager[this.eventId] = null;
        requestRedraw();
        if (canvasManager.every(elem => elem === null)) {
            canvasManager = [];
        }
        if (eventManager.every(elem => elem === null)) {
            eventManager = [];
        }
    }

    public set xf(val: number) { canvasManager[this.base].xf = val; }
    public set yf(val: number) { canvasManager[this.base].yf = val; }
    public set xt(val: number) { canvasManager[this.base].xt = val; }
    public set yt(val: number) { canvasManager[this.base].yt = val; }

    public get xf(): number { return canvasManager[this.base].xf; }
    public get yf(): number { return canvasManager[this.base].yf; }
    public get xt(): number { return canvasManager[this.base].xt; }
    public get yt(): number { return canvasManager[this.base].yt; }

    public isInside(mx: number, my: number): boolean {
        return canvasManager[this.base].isInside(mx, my);
    }

    // event

    rightclick(mx: number, my: number) {
        this.destroy();
    } 

    mousedown(mx: number, my: number) {

    }

    mousemove(mx: number, my: number) {
        if (DRAWING && DRAWING_EVENT_HANDLE == this.eventId) {
            this.xt = mx;
            this.yt = my;
        }
    }

    mouseup(mx: number, my: number) {
        if (DRAWING && DRAWING_EVENT_HANDLE == this.eventId) {
            for (let EObject of eventManager) {
                if (EObject && EObject.source && canvasManager[EObject.source].isInside(mx, my)) {
                    this.xt = canvasManager[EObject.source].x + 5;
                    this.yt = canvasManager[EObject.source].y + 5;
                    this.storyLink.to = EObject.source;
                    DRAWING = false;
                    DRAWING_EVENT_HANDLE = -1;
                    return;
                }
            }
            DRAWING = false;
            DRAWING_EVENT_HANDLE = -1;
            this.destroy();
        }
    }

    form() {
        console.log(this.storyLink);
    }
}

console.log("COMPLEX.TS LOADED");
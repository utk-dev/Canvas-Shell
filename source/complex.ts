/** Is there a Complex Shape currently being drawn on the canvas? */
let DRAWING: boolean = false;

/** ```eventId``` of the Complex Shape that is currently being drawn. (-1 if no shape is being drawn) */
let DRAWING_EVENT_HANDLE: number = -1;

/** Is there a Complex Shape currently being dragged around on the canvas? */
let DRAGGING: boolean = false;

/** ``` eventId of the Complex Shape currently being dragged around on the canvas. (-1 if no shape is being dragged) */
let DRAGGING_EVENT_HANDLE: number = -1;

/** If the Complex Shape that is being dragged currently has its top-left coordinate (x, y) and the point at which our mouse
 * is grabbing the shape is (mx, my) then this variable contains (mx - x).
 */
let DRAG_HOLD_OFFSET_X: number = -1;

/** If the Complex Shape that is being dragged currently has its top-left coordinate (x, y) and the point at which our mouse
 * is grabbing the shape is (mx, my) then this variable contains (my - y).
 */
let DRAG_HOLD_OFFSET_Y: number = -1;

/** Is the whole Canvas being dragged currently? */
let DRAGGING_CANVAS: boolean = false;

/** ```eventId``` of the Complex Shape currently selected. (-1 if no shape is selected)
 * Selected shape shows up as red colored on the canvas.
 */
let SELECTED_HANDLE: number = -1;

/** Color of the Shape it resets to when it is un-selected */
let RESET_COLOR: Color;

/**
 * A Complex Shape encapsulating the primitve shapes, the story data and the event handlers required to completely
 * describe a story section - both visual and behaviour aspects.
 */
class CSection {
    private _x: number;
    private _y: number;

    /** The actual data related to a story section */
    public storySection: SSection;

    /** ```hwnd``` of the Primitive Rectangle representing the base area of the CSection */
    public base: number;

    /** ```hwnd``` of the Primitive Rectangle representing the source node of the CSection (SLink.to) */
    public source: number;

    /** Array of ```hwnd``` of the Primitive Rectangles representing the sink nodes of the CSection (SLink.from) */
    public sink: Array<number>;

    /** **Readonly** Index of this CSection in the ```eventManager``` array.
     *  It can be used like a pointer to this instance of the CSection.
     */
    public eventId: number;

    /**
     * Constructs a new CSection with dimensions (100 x 100) pixels
     * @param x X coordinate of the top-left of this CSection
     * @param y Y coordinate of the top-left of this CSection
     * @param no_of_sinks Number of sink nodes in this CSection
     * @param has_source Does this CSection have a source node?
     */
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

    /**
     * Updates the number of sinks in this CSection (deletes all existing sinks)
     * @param sinkCount - _new_ number of sinks
     */
    private updateSinkCount(sinkCount: number): void {
        this.sink = new Array<number>();
        let g: number = 100 / (sinkCount + 1);
        for (let i = 1; i <= sinkCount; i++) {
            this.sink.push((new PRect(this._x+90, this._y+g*i-5, 10, 10, Color.Blue, Style.Fill)).hwnd);
        }
    }

    /**
     * Get the line that is attached with a node whose `hwnd` is `canvasHandle` and is a `end` (source/sink) type of node.
     * This method is used for moving a line along-with the shapes it is attached to.
     * @param canvasHandle - `hwnd` of the Primitive Shape where the line is attached.
     * @param end - "to" or "from" - what type of attachment does the line have with this Primitive Shape?
     * @returns `eventId` of the CLink that satisfies the above conditions or null if there is no such line.
     */    
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

    /** X coordinate of the top-left of this CSection */
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

    /** Y coordinate of the top-left of this CSection */
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

    /** Does this CSection have a source? */
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

    /** How many sinks does this CSection have? */
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

    /** X coordinate of the top-left of this CSection  */
    public get x(): number { return this._x; }

    /** Y coordinate of the top-left of this CSection  */
    public get y(): number { return this._y; }

    /** How many sinks does this CSection have? */
    public get no_of_sinks(): number { return this.sink.length; }

    /** Does this CSection have a source? */
    public get has_source(): boolean { return !!this.source; }

    /**
     * Check if a coordinate (mx, my) is inside the (100x100) area occupied by this CSection
     * @param mx X coordinate
     * @param my Y coordinate
     * @returns `true` if (mx, my) is inside this CSection, `false` otherwise.
     */
    public isInside(mx: number, my: number): boolean {
        return this._x <= mx && this._y <= my && mx <= this._x + 100 && my <= this._y + 100;
    }

    // ============= EVENTS ============= 

    /**
     * Right Click Event Handler
     * @param mx - **Not Functional** X-coordinate of mouse click
     * @param my - **Not Functional** Y-coordinate of mouse click
     */
    rightclick(mx: number, my: number) {
        this.destroy();
    }

    /**
     * Mouse Down Event Handler
     * @param mx X-coordinate of mouse down
     * @param my Y-coordinate of mouse down
     */
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

    /**
     * Mouse Move Event Handler
     * @param mx Current X-coordinate of the mouse
     * @param my Current Y-coordinate of the mouse
     */
    mousemove(mx: number, my: number) {
        if (DRAGGING && DRAGGING_EVENT_HANDLE == this.eventId) {
            this.x = mx - DRAG_HOLD_OFFSET_X; 
            this.y = my - DRAG_HOLD_OFFSET_Y;
        }
    } 

    /**
     * Mouse Up Event Handler
     * @param mx X-coordinate at which the mouse pointer was last down
     * @param my Y-coordinate at which the mouse pointer was last down
     */
    mouseup(mx: number, my: number) {
        if (DRAGGING && DRAGGING_EVENT_HANDLE == this.eventId) {
            DRAGGING = false;
        }
    }

    /**
     * **Not Functional** Form Display handler
     */
    form() {
        console.log(this.storySection);
    }

    // ============= UTILITY =============
    
    /** Tells the garbage collector to destruct this object by removing all memory references to it. */
    destroy() {
        DRAGGING = false;
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

/**
 * A Complex Shape encapsulating the primitve shapes, the story data and the event handlers required to completely
 * describe a story link - both visual and behaviour aspects.
 */
class CLink {

    /** ```hwnd``` of the Primitive Line representing the visual aspects of this CLink */
    public base: number;

    /** The actual data related to a story link - including the text on the button */
    public storyLink: SLink;

    /** **Readonly** Index of this CLink in the ```eventManager``` array.
     *  It can be used like a pointer to this instance of the CLink.
     */
    public eventId: number;

    /**
     * Constructs a new CLink with default thickness
     * @param xf X coordinate of the starting point of the line.
     * @param yf Y coordinate of the starting point of the line.
     * @param xt X coordinate of the ending point of the line.
     * @param yt Y coordinate of the ending point of the line.
     * @param FromSink which node does this line originate from (required to actively draw the line)
     */
    constructor(xf: number, yf: number, xt: number, yt: number, FromSink: number) {
        this.base = (new PLine(xf, yf, xt, yt, Color.Black)).hwnd;
        this.storyLink = new SLink();
        this.storyLink.from = FromSink;
        this.eventId = eventManager.length;
        eventManager.push(this);
    } 

    // ============= UTILITY =============
    
    /** Tells the garbage collector to destruct this object by removing all memory references to it. */
    public destroy() {
        DRAGGING = false;
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

    /** X coordinate of the starting point of the line. */
    public set xf(val: number) { canvasManager[this.base].xf = val; }

    /** Y coordinate of the starting point of the line. */
    public set yf(val: number) { canvasManager[this.base].yf = val; }

    /** X coordinate of the ending point of the line. */
    public set xt(val: number) { canvasManager[this.base].xt = val; }

    /** Y coordinate of the starting point of the line. */
    public set yt(val: number) { canvasManager[this.base].yt = val; }

    /** X coordinate of the starting point of the line. */
    public get xf(): number { return canvasManager[this.base].xf; }

    /** Y coordinate of the starting point of the line. */
    public get yf(): number { return canvasManager[this.base].yf; }

    /** X coordinate of the ending point of the line. */
    public get xt(): number { return canvasManager[this.base].xt; }

    /** Y coordinate of the ending point of the line. */
    public get yt(): number { return canvasManager[this.base].yt; }

    /**
     * Checks if a coordinate (mx, my) is on the Primitive Line of this CLink
     * @param mx X Coordinate
     * @param my Y Coordinate
     * @returns `true` if (mx, my) is on this CLink, `false` otherwise
     */
    public isInside(mx: number, my: number): boolean {
        return canvasManager[this.base].isInside(mx, my);
    }

    // ============= EVENTS =============

    /**
     * Right Click Event Handler
     * @param mx - **Not Functional** X-coordinate of mouse click
     * @param my - **Not Functional** Y-coordinate of mouse click
     */
    rightclick(mx: number, my: number) {
        this.destroy();
    } 

    /**
     * **Not Functional** Mouse Down Event Handler - Provided for consistency purposes
     * @param mx - **Not Functional** X-coordinate of mouse down
     * @param my - **Not Functional** Y-coordinate of mouse down
     */
    mousedown(mx: number, my: number) {

    }

    /**
     * Mouse Move Event Handler
     * @param mx Current X coordinate of the mouse
     * @param my Current Y coordinate of the mouse
     */
    mousemove(mx: number, my: number) {
        if (DRAWING && DRAWING_EVENT_HANDLE == this.eventId) {
            this.xt = mx;
            this.yt = my;
        }
    }

    /**
     * Mouse Up Event Handler
     * @param mx X-coordinate at which the mouse pointer was last down
     * @param my Y-coordinate at which the mouse pointer was last down
     */
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

    /**
     * **Not Functional** Form Display Handler
     */
    form() {
        console.log(this.storyLink);
    }
}

// console.log("COMPLEX.TS LOADED");
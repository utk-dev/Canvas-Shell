/** Is there a Complex Shape currently being drawn on the canvas? */
var DRAWING = false;
/** ```eventId``` of the Complex Shape that is currently being drawn. (-1 if no shape is being drawn) */
var DRAWING_EVENT_HANDLE = -1;
/** Is there a Complex Shape currently being dragged around on the canvas? */
var DRAGGING = false;
/** ``` eventId of the Complex Shape currently being dragged around on the canvas. (-1 if no shape is being dragged) */
var DRAGGING_EVENT_HANDLE = -1;
/** If the Complex Shape that is being dragged currently has its top-left coordinate (x, y) and the point at which our mouse
 * is grabbing the shape is (mx, my) then this variable contains (mx - x).
 */
var DRAG_HOLD_OFFSET_X = -1;
/** If the Complex Shape that is being dragged currently has its top-left coordinate (x, y) and the point at which our mouse
 * is grabbing the shape is (mx, my) then this variable contains (my - y).
 */
var DRAG_HOLD_OFFSET_Y = -1;
/** Is the whole Canvas being dragged currently? */
var DRAGGING_CANVAS = false;
/** ```eventId``` of the Complex Shape currently selected. (-1 if no shape is selected)
 * Selected shape shows up as red colored on the canvas.
 */
var SELECTED_HANDLE = -1;
/** Color of the Shape it resets to when it is un-selected */
var RESET_COLOR;
/**
 * A Complex Shape encapsulating the primitve shapes, the story data and the event handlers required to completely
 * describe a story section - both visual and behaviour aspects.
 */
var CSection = /** @class */ (function () {
    /**
     * Constructs a new CSection with dimensions (100 x 100) pixels
     * @param x X coordinate of the top-left of this CSection
     * @param y Y coordinate of the top-left of this CSection
     * @param no_of_sinks Number of sink nodes in this CSection
     * @param has_source Does this CSection have a source node?
     */
    function CSection(x, y, no_of_sinks, has_source) {
        this._x = x;
        this._y = y;
        this.storySection = new SSection();
        this.base = (new PRect(x + 10, y, 80, 100, Color.Green, Style.Fill)).hwnd;
        this.storySection.storyPos = this.base.toString();
        if (has_source) {
            this.source = (new PRect(x, y + 45, 10, 10, Color.Blue, Style.Fill)).hwnd;
        }
        else {
            this.source = undefined;
        }
        this.sink = new Array();
        this.updateSinkCount(no_of_sinks);
        this.eventId = eventManager.length;
        eventManager.push(this);
    }
    /**
     * Updates the number of sinks in this CSection (deletes all existing sinks)
     * @param sinkCount - _new_ number of sinks
     */
    CSection.prototype.updateSinkCount = function (sinkCount) {
        this.sink = new Array();
        var g = 100 / (sinkCount + 1);
        for (var i = 1; i <= sinkCount; i++) {
            this.sink.push((new PRect(this._x + 90, this._y + g * i - 5, 10, 10, Color.Blue, Style.Fill)).hwnd);
        }
    };
    /**
     * Get the line that is attached with a node whose `hwnd` is `canvasHandle` and is a `end` (source/sink) type of node.
     * This method is used for moving a line along-with the shapes it is attached to.
     * @param canvasHandle - `hwnd` of the Primitive Shape where the line is attached.
     * @param end - "to" or "from" - what type of attachment does the line have with this Primitive Shape?
     * @returns `eventId` of the CLink that satisfies the above conditions or null if there is no such line.
     */
    CSection.prototype.getLineToSyncWith = function (canvasHandle, end) {
        for (var i = 0; i < eventManager.length; i++) {
            if (eventManager[i] && eventManager[i].storyLink) {
                var cond1 = (end == "to" && eventManager[i].storyLink.to == canvasHandle);
                var cond2 = (end == "from" && eventManager[i].storyLink.from == canvasHandle);
                if (cond1 || cond2)
                    return i;
            }
        }
        return null;
    };
    Object.defineProperty(CSection.prototype, "x", {
        /** X coordinate of the top-left of this CSection  */
        get: function () { return this._x; },
        /** X coordinate of the top-left of this CSection */
        set: function (val) {
            var diff = val - this._x;
            this._x = val;
            canvasManager[this.base].x += diff;
            if (this.source) {
                var eHandle = this.getLineToSyncWith(this.source, "to");
                if (eHandle !== null)
                    eventManager[eHandle].xt += diff;
                canvasManager[this.source].x += diff;
            }
            for (var _i = 0, _a = this.sink; _i < _a.length; _i++) {
                var sinkItem = _a[_i];
                var eHandle = this.getLineToSyncWith(sinkItem, "from");
                if (eHandle !== null)
                    eventManager[eHandle].xf += diff;
                canvasManager[sinkItem].x += diff;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CSection.prototype, "y", {
        /** Y coordinate of the top-left of this CSection  */
        get: function () { return this._y; },
        /** Y coordinate of the top-left of this CSection */
        set: function (val) {
            var diff = val - this._y;
            this._y = val;
            canvasManager[this.base].y += diff;
            if (this.source) {
                var eHandle = this.getLineToSyncWith(this.source, "to");
                if (eHandle !== null)
                    eventManager[eHandle].yt += diff;
                canvasManager[this.source].y += diff;
            }
            for (var _i = 0, _a = this.sink; _i < _a.length; _i++) {
                var sinkItem = _a[_i];
                var eHandle = this.getLineToSyncWith(sinkItem, "from");
                if (eHandle !== null)
                    eventManager[eHandle].yf += diff;
                canvasManager[sinkItem].y += diff;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CSection.prototype, "has_source", {
        /** Does this CSection have a source? */
        get: function () { return !!this.source; },
        /** Does this CSection have a source? */
        set: function (val) {
            if (val && this.source === undefined) {
                this.source = (new PRect(this._x, this._y + 45, 10, 10, Color.Blue, Style.Fill)).hwnd;
            }
            else if (!val && this.source !== undefined) {
                var eHandle = this.getLineToSyncWith(this.source, "to");
                if (eHandle !== null)
                    eventManager[eHandle].destroy(); // delete the link attached to this source
                canvasManager[this.source] = null; // delete the primitive from canvasManager
                requestRedraw(); // redraw the canvas
                this.source = undefined; // update the CSection object to sync changes
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CSection.prototype, "no_of_sinks", {
        /** How many sinks does this CSection have? */
        get: function () { return this.sink.length; },
        /** How many sinks does this CSection have? */
        set: function (val) {
            if (val !== this.sink.length) {
                for (var _i = 0, _a = this.sink; _i < _a.length; _i++) {
                    var sinkItem = _a[_i];
                    var eHandle = this.getLineToSyncWith(sinkItem, "from");
                    if (eHandle !== null)
                        eventManager[eHandle].destroy();
                    canvasManager[sinkItem] = null;
                }
                this.updateSinkCount(val);
                requestRedraw();
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Check if a coordinate (mx, my) is inside the (100x100) area occupied by this CSection
     * @param mx X coordinate
     * @param my Y coordinate
     * @returns `true` if (mx, my) is inside this CSection, `false` otherwise.
     */
    CSection.prototype.isInside = function (mx, my) {
        return this._x <= mx && this._y <= my && mx <= this._x + 100 && my <= this._y + 100;
    };
    // ============= EVENTS ============= 
    /**
     * Right Click Event Handler
     * @param mx - **Not Functional** X-coordinate of mouse click
     * @param my - **Not Functional** Y-coordinate of mouse click
     */
    CSection.prototype.rightclick = function (mx, my) {
        this.destroy();
    };
    /**
     * Mouse Down Event Handler
     * @param mx X-coordinate of mouse down
     * @param my Y-coordinate of mouse down
     */
    CSection.prototype.mousedown = function (mx, my) {
        if (!DRAGGING && canvasManager[this.base].isInside(mx, my)) {
            DRAGGING = true;
            DRAGGING_EVENT_HANDLE = this.eventId;
            DRAG_HOLD_OFFSET_X = mx - this.x;
            DRAG_HOLD_OFFSET_Y = my - this.y;
            return;
        }
        if (!DRAWING) {
            for (var _i = 0, _a = this.sink; _i < _a.length; _i++) {
                var sinkItem = _a[_i];
                var sinkObject = canvasManager[sinkItem];
                if (sinkObject.isInside(mx, my)) {
                    DRAWING_EVENT_HANDLE = (new CLink(sinkObject.x + 5, sinkObject.y + 5, mx, my, sinkItem)).eventId;
                    console.log(DRAWING_EVENT_HANDLE);
                    DRAWING = true;
                    return;
                }
            }
        }
    };
    /**
     * Mouse Move Event Handler
     * @param mx Current X-coordinate of the mouse
     * @param my Current Y-coordinate of the mouse
     */
    CSection.prototype.mousemove = function (mx, my) {
        if (DRAGGING && DRAGGING_EVENT_HANDLE == this.eventId) {
            this.x = mx - DRAG_HOLD_OFFSET_X;
            this.y = my - DRAG_HOLD_OFFSET_Y;
        }
    };
    /**
     * Mouse Up Event Handler
     * @param mx X-coordinate at which the mouse pointer was last down
     * @param my Y-coordinate at which the mouse pointer was last down
     */
    CSection.prototype.mouseup = function (mx, my) {
        if (DRAGGING && DRAGGING_EVENT_HANDLE == this.eventId) {
            DRAGGING = false;
        }
    };
    /**
     * **Not Functional** Form Display handler
     */
    CSection.prototype.form = function () {
        console.log(this.storySection);
    };
    // ============= UTILITY =============
    /** Tells the garbage collector to destruct this object by removing all memory references to it. */
    CSection.prototype.destroy = function () {
        DRAGGING = false;
        for (var _i = 0, eventManager_1 = eventManager; _i < eventManager_1.length; _i++) {
            var EObject = eventManager_1[_i];
            if (EObject && EObject.storyLink && (this.sink.includes(EObject.storyLink.from) || this.sink.includes(EObject.storyLink.to))) {
                EObject.destroy();
            }
        }
        if (this.source) {
            var eHandle = this.getLineToSyncWith(this.source, "to");
            if (eHandle !== null)
                eventManager[eHandle].destroy();
        }
        eventManager[this.eventId] = null;
        canvasManager[this.source] = null;
        for (var _a = 0, _b = this.sink; _a < _b.length; _a++) {
            var CObject = _b[_a];
            canvasManager[CObject] = null;
        }
        canvasManager[this.base] = null;
        requestRedraw();
        if (canvasManager.every(function (elem) { return elem === null; })) {
            canvasManager = [];
        }
        if (eventManager.every(function (elem) { return elem === null; })) {
            eventManager = [];
        }
    };
    return CSection;
}());
/**
 * A Complex Shape encapsulating the primitve shapes, the story data and the event handlers required to completely
 * describe a story link - both visual and behaviour aspects.
 */
var CLink = /** @class */ (function () {
    /**
     * Constructs a new CLink with default thickness
     * @param xf X coordinate of the starting point of the line.
     * @param yf Y coordinate of the starting point of the line.
     * @param xt X coordinate of the ending point of the line.
     * @param yt Y coordinate of the ending point of the line.
     * @param FromSink which node does this line originate from (required to actively draw the line)
     */
    function CLink(xf, yf, xt, yt, FromSink) {
        this.base = (new PLine(xf, yf, xt, yt, Color.Black)).hwnd;
        this.storyLink = new SLink();
        this.storyLink.from = FromSink;
        this.eventId = eventManager.length;
        eventManager.push(this);
    }
    // ============= UTILITY =============
    /** Tells the garbage collector to destruct this object by removing all memory references to it. */
    CLink.prototype.destroy = function () {
        DRAGGING = false;
        canvasManager[this.base] = null;
        this.storyLink = null;
        eventManager[this.eventId] = null;
        requestRedraw();
        if (canvasManager.every(function (elem) { return elem === null; })) {
            canvasManager = [];
        }
        if (eventManager.every(function (elem) { return elem === null; })) {
            eventManager = [];
        }
    };
    Object.defineProperty(CLink.prototype, "xf", {
        /** X coordinate of the starting point of the line. */
        get: function () { return canvasManager[this.base].xf; },
        /** X coordinate of the starting point of the line. */
        set: function (val) { canvasManager[this.base].xf = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CLink.prototype, "yf", {
        /** Y coordinate of the starting point of the line. */
        get: function () { return canvasManager[this.base].yf; },
        /** Y coordinate of the starting point of the line. */
        set: function (val) { canvasManager[this.base].yf = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CLink.prototype, "xt", {
        /** X coordinate of the ending point of the line. */
        get: function () { return canvasManager[this.base].xt; },
        /** X coordinate of the ending point of the line. */
        set: function (val) { canvasManager[this.base].xt = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CLink.prototype, "yt", {
        /** Y coordinate of the ending point of the line. */
        get: function () { return canvasManager[this.base].yt; },
        /** Y coordinate of the starting point of the line. */
        set: function (val) { canvasManager[this.base].yt = val; },
        enumerable: false,
        configurable: true
    });
    /**
     * Checks if a coordinate (mx, my) is on the Primitive Line of this CLink
     * @param mx X Coordinate
     * @param my Y Coordinate
     * @returns `true` if (mx, my) is on this CLink, `false` otherwise
     */
    CLink.prototype.isInside = function (mx, my) {
        return canvasManager[this.base].isInside(mx, my);
    };
    // ============= EVENTS =============
    /**
     * Right Click Event Handler
     * @param mx - **Not Functional** X-coordinate of mouse click
     * @param my - **Not Functional** Y-coordinate of mouse click
     */
    CLink.prototype.rightclick = function (mx, my) {
        this.destroy();
    };
    /**
     * **Not Functional** Mouse Down Event Handler - Provided for consistency purposes
     * @param mx - **Not Functional** X-coordinate of mouse down
     * @param my - **Not Functional** Y-coordinate of mouse down
     */
    CLink.prototype.mousedown = function (mx, my) {
    };
    /**
     * Mouse Move Event Handler
     * @param mx Current X coordinate of the mouse
     * @param my Current Y coordinate of the mouse
     */
    CLink.prototype.mousemove = function (mx, my) {
        if (DRAWING && DRAWING_EVENT_HANDLE == this.eventId) {
            this.xt = mx;
            this.yt = my;
        }
    };
    /**
     * Mouse Up Event Handler
     * @param mx X-coordinate at which the mouse pointer was last down
     * @param my Y-coordinate at which the mouse pointer was last down
     */
    CLink.prototype.mouseup = function (mx, my) {
        if (DRAWING && DRAWING_EVENT_HANDLE == this.eventId) {
            for (var _i = 0, eventManager_2 = eventManager; _i < eventManager_2.length; _i++) {
                var EObject = eventManager_2[_i];
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
    };
    /**
     * **Not Functional** Form Display Handler
     */
    CLink.prototype.form = function () {
        console.log(this.storyLink);
    };
    return CLink;
}());
// console.log("COMPLEX.TS LOADED");

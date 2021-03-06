var DRAWING = false;
var DRAWING_EVENT_HANDLE = -1;
var DRAGGING = false;
var DRAGGING_EVENT_HANDLE = -1;
var DRAG_HOLD_OFFSET_X = -1;
var DRAG_HOLD_OFFSET_Y = -1;
var DRAGGING_CANVAS = false;
var SELECTED_HANDLE = -1;
var RESET_COLOR;
var CSection = /** @class */ (function () {
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
    CSection.prototype.updateSinkCount = function (sinkCount) {
        this.sink = new Array();
        var g = 100 / (sinkCount + 1);
        for (var i = 1; i <= sinkCount; i++) {
            this.sink.push((new PRect(this._x + 90, this._y + g * i - 5, 10, 10, Color.Blue, Style.Fill)).hwnd);
        }
    };
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
        get: function () { return this._x; },
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
        get: function () { return this._y; },
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
        get: function () { return !!this.source; },
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
        get: function () { return this.sink.length; },
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
    CSection.prototype.isInside = function (mx, my) {
        return this._x <= mx && this._y <= my && mx <= this._x + 100 && my <= this._y + 100;
    };
    // events
    CSection.prototype.rightclick = function (mx, my) {
        this.destroy();
    };
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
    CSection.prototype.mousemove = function (mx, my) {
        if (DRAGGING && DRAGGING_EVENT_HANDLE == this.eventId) {
            this.x = mx - DRAG_HOLD_OFFSET_X;
            this.y = my - DRAG_HOLD_OFFSET_Y;
        }
    };
    CSection.prototype.mouseup = function (mx, my) {
        if (DRAGGING && DRAGGING_EVENT_HANDLE == this.eventId) {
            DRAGGING = false;
        }
    };
    CSection.prototype.form = function () {
        console.log(this.storySection);
    };
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
var CLink = /** @class */ (function () {
    function CLink(xf, yf, xt, yt, FromSink) {
        this.base = (new PLine(xf, yf, xt, yt, Color.Black)).hwnd;
        this.storyLink = new SLink();
        this.storyLink.from = FromSink;
        this.eventId = eventManager.length;
        eventManager.push(this);
    }
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
        get: function () { return canvasManager[this.base].xf; },
        set: function (val) { canvasManager[this.base].xf = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CLink.prototype, "yf", {
        get: function () { return canvasManager[this.base].yf; },
        set: function (val) { canvasManager[this.base].yf = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CLink.prototype, "xt", {
        get: function () { return canvasManager[this.base].xt; },
        set: function (val) { canvasManager[this.base].xt = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CLink.prototype, "yt", {
        get: function () { return canvasManager[this.base].yt; },
        set: function (val) { canvasManager[this.base].yt = val; },
        enumerable: false,
        configurable: true
    });
    CLink.prototype.isInside = function (mx, my) {
        return canvasManager[this.base].isInside(mx, my);
    };
    // event
    CLink.prototype.rightclick = function (mx, my) {
        this.destroy();
    };
    CLink.prototype.mousedown = function (mx, my) {
    };
    CLink.prototype.mousemove = function (mx, my) {
        if (DRAWING && DRAWING_EVENT_HANDLE == this.eventId) {
            this.xt = mx;
            this.yt = my;
        }
    };
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
    CLink.prototype.form = function () {
        console.log(this.storyLink);
    };
    return CLink;
}());
console.log("COMPLEX.TS LOADED");

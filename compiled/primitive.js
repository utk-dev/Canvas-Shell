/** Whether to fill the shape with a solid color (```Fill```) or just draw the outline (```Stroke```) */
var Style;
(function (Style) {
    Style[Style["Fill"] = 0] = "Fill";
    Style[Style["Stroke"] = 1] = "Stroke";
})(Style || (Style = {}));
/** Color Palette with Pre-defined colors */
var Color;
(function (Color) {
    Color["Red"] = "rgb(255, 0, 0)";
    Color["Green"] = "rgb(0, 255, 0)";
    Color["Blue"] = "rgb(0, 0, 255)";
    Color["Black"] = "rgb(0, 0, 0)";
    Color["Yellow"] = "rgb(255, 255, 0)";
})(Color || (Color = {}));
/**
 * Represents a Primitive Rectangle uniquely identified in the ```canvasManager``` array
 * by its readonly property ```hwnd```.
 */
var PRect = /** @class */ (function () {
    /**
     * Constructs a PRect object
     *
     * _Initializing an object of this class will draw it on the screen immediately_
     * @param x - X-coordinate of the top-left corner of the Rectangle
     * @param y - Y-coordinate of the top-left corner of the Rectangle
     * @param w - Width of the Rectangle
     * @param h - Height of the Rectangle
     * @param color - Color of the Rectangle. The way this property will be used depends on the ```style``` property
     * @param style - Whether to fill the shape with a solid color (Fill) or just draw the outline (Stroke)
     */
    function PRect(x, y, w, h, color, style) {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
        this._color = color;
        this._style = style;
        this._hwnd = canvasManager.length;
        canvasManager.push(this);
        requestRedraw();
    }
    Object.defineProperty(PRect.prototype, "x", {
        /** X-coordinate of the top-left corner of the Rectangle */
        get: function () { return this._x; },
        /** X-coordinate of the top-left corner of the Rectangle */
        set: function (val) { this._x = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PRect.prototype, "y", {
        /** Y-coordinate of the top-left corner of the Rectangle */
        get: function () { return this._y; },
        /** Y-coordinate of the top-left corner of the Rectangle */
        set: function (val) { this._y = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PRect.prototype, "w", {
        /** Width of the Rectangle */
        get: function () { return this._w; },
        /** Width of the Rectangle */
        set: function (val) { this._w = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PRect.prototype, "h", {
        /** Height of the Rectangle */
        get: function () { return this._h; },
        /** Height of the Rectangle */
        set: function (val) { this._h = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PRect.prototype, "color", {
        /** Color of the Rectangle. The way this property will be used depends on the ```style``` property. */
        get: function () { return this._color; },
        /** Color of the Rectangle. The way this property will be used depends on the ```style``` property. */
        set: function (val) { this._color = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PRect.prototype, "style", {
        /** Whether to fill the shape with a solid color (```Fill```) or just draw the outline (```stroke```) */
        get: function () { return this._style; },
        /** Whether to fill the shape with a solid color (```Fill```) or just draw the outline (```stroke```) */
        set: function (val) { this._style = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PRect.prototype, "hwnd", {
        /** **Readonly** Index of this Rectangle in the ```canvasManager``` array.
         *  It can be used like a pointer to this instance of the Rectangle.
         */
        get: function () { return this._hwnd; },
        enumerable: false,
        configurable: true
    });
    /** CanvasAPI instructions specifying how to actually draw this shape on the Canvas */
    PRect.prototype.draw = function () {
        if (this._style == Style.Fill) {
            canvas.fillStyle = this._color;
            canvas.fillRect(this._x, this._y, this._w, this._h);
        }
        else {
            canvas.strokeStyle = this._color;
            canvas.strokeRect(this._x, this._y, this._w, this._h);
        }
    };
    /**
     * Checks if a coordinate (mx, my) is inside this Rectangle
     * @param mx X coordinate
     * @param my Y coordinate
     * @returns ```true``` if (mx, my) is inside this Rectangle; ```false``` otherwise
     */
    PRect.prototype.isInside = function (mx, my) {
        return this._x <= mx && this._y <= my && mx <= this._x + this._w && my <= this._y + this._h;
    };
    return PRect;
}());
/**
 * Represents a Primitive Line uniquely identified in the ```canvasManager``` array
 * by its readonly property ```hwnd```.
 */
var PLine = /** @class */ (function () {
    /**
     * Constructs a PLine object.
     *
     * _Initializing an object of this class will draw it on the screen immediately._
     * @param xf X coordinate of the starting point of the line.
     * @param yf Y coordinate of the starting point of the line.
     * @param xt X coordinate of the ending point of the line.
     * @param yt Y coordinate of the ending point of the line.
     * @param color color of the line (picked from the ```Color``` enumeration)
     */
    function PLine(xf, yf, xt, yt, color) {
        this._xf = xf;
        this._yf = yf;
        this._xt = xt;
        this._yt = yt;
        this._color = color;
        this._hwnd = canvasManager.length;
        canvasManager.push(this);
        requestRedraw();
    }
    Object.defineProperty(PLine.prototype, "xf", {
        /** X coordinate of the starting point of the line. */
        get: function () { return this._xf; },
        /** X coordinate of the starting point of the line. */
        set: function (val) { this._xf = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PLine.prototype, "yf", {
        /** Y coordinate of the starting point of the line. */
        get: function () { return this._yf; },
        /** Y coordinate of the starting point of the line. */
        set: function (val) { this._yf = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PLine.prototype, "xt", {
        /** X coordinate of the ending point of the line. */
        get: function () { return this._xt; },
        /** X coordinate of the ending point of the line. */
        set: function (val) { this._xt = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PLine.prototype, "yt", {
        /** Y coordinate of the ending point of the line. */
        get: function () { return this._yt; },
        /** Y coordinate of the ending point of the line. */
        set: function (val) { this._yt = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PLine.prototype, "color", {
        /** color of the line (picked from the ```Color``` enumeration) */
        get: function () { return this._color; },
        /** color of the line (picked from the ```Color``` enumeration) */
        set: function (val) { this._color = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PLine.prototype, "hwnd", {
        /** **Readonly** Index of this Line in the ```canvasManager``` array.
         *  It can be used like a pointer to this instance of the Line.
         */
        get: function () { return this._hwnd; },
        enumerable: false,
        configurable: true
    });
    /** CanvasAPI instructions specifying how to actually draw this shape on the Canvas */
    PLine.prototype.draw = function () {
        canvas.beginPath();
        canvas.strokeStyle = this._color;
        canvas.moveTo(this._xf, this._yf);
        canvas.lineTo(this._xt, this._yt);
        canvas.stroke();
        canvas.closePath();
    };
    /**
     * Checks if a coordinate (mx, my) is on this Line
     *
     * @param mx X coordinate
     * @param my Y coordinate
     * @returns ```true``` if (mx, my) is less than or equal to 4 pixels away from this line; ```false``` otherwise
     */
    PLine.prototype.isInside = function (mx, my) {
        // "distance from a point to a line" formula
        var nu = Math.abs((this._yt - this._yf) * mx + (this._xf - this._xt) * my + (this._xt * this._yf - this._xf * this._yt));
        var de = Math.sqrt((this._yt - this._yf) * (this._yt - this._yf) + (this._xf - this._xt) * (this._xf - this._xt));
        return (nu / de) <= 4;
    };
    return PLine;
}());
//console.log("PRIMITIVE.TS LOADED");

var Style;
(function (Style) {
    Style[Style["Fill"] = 0] = "Fill";
    Style[Style["Stroke"] = 1] = "Stroke";
})(Style || (Style = {}));
var Color;
(function (Color) {
    Color["Red"] = "rgb(255, 0, 0)";
    Color["Green"] = "rgb(0, 255, 0)";
    Color["Blue"] = "rgb(0, 0, 255)";
    Color["Black"] = "rgb(0, 0, 0)";
    Color["Yellow"] = "rgb(255, 255, 0)";
})(Color || (Color = {}));
var PRect = (function () {
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
        get: function () { return this._x; },
        set: function (val) { this._x = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PRect.prototype, "y", {
        get: function () { return this._y; },
        set: function (val) { this._y = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PRect.prototype, "w", {
        get: function () { return this._w; },
        set: function (val) { this._w = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PRect.prototype, "h", {
        get: function () { return this._h; },
        set: function (val) { this._h = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PRect.prototype, "color", {
        get: function () { return this._color; },
        set: function (val) { this._color = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PRect.prototype, "style", {
        get: function () { return this._style; },
        set: function (val) { this._style = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PRect.prototype, "hwnd", {
        get: function () { return this._hwnd; },
        enumerable: false,
        configurable: true
    });
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
    PRect.prototype.isInside = function (mx, my) {
        return this._x <= mx && this._y <= my && mx <= this._x + this._w && my <= this._y + this._h;
    };
    return PRect;
}());
var PLine = (function () {
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
        get: function () { return this._xf; },
        set: function (val) { this._xf = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PLine.prototype, "yf", {
        get: function () { return this._yf; },
        set: function (val) { this._yf = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PLine.prototype, "xt", {
        get: function () { return this._xt; },
        set: function (val) { this._xt = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PLine.prototype, "yt", {
        get: function () { return this._yt; },
        set: function (val) { this._yt = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PLine.prototype, "color", {
        get: function () { return this._color; },
        set: function (val) { this._color = val; requestRedraw(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PLine.prototype, "hwnd", {
        get: function () { return this._hwnd; },
        enumerable: false,
        configurable: true
    });
    PLine.prototype.draw = function () {
        canvas.beginPath();
        canvas.strokeStyle = this._color;
        canvas.moveTo(this._xf, this._yf);
        canvas.lineTo(this._xt, this._yt);
        canvas.stroke();
        canvas.closePath();
    };
    PLine.prototype.isInside = function (mx, my) {
        var nu = Math.abs((this._yt - this._yf) * mx + (this._xf - this._xt) * my + (this._xt * this._yf - this._xf * this._yt));
        var de = Math.sqrt((this._yt - this._yf) * (this._yt - this._yf) + (this._xf - this._xt) * (this._xf - this._xt));
        return (nu / de) <= 4;
    };
    return PLine;
}());

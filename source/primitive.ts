/** Whether to fill the shape with a solid color (```Fill```) or just draw the outline (```Stroke```) */
enum Style {
    Fill,
    Stroke
}

/** Color Palette with Pre-defined colors */
enum Color {
    Red = "rgb(255, 0, 0)",
    Green = "rgb(0, 255, 0)",
    Blue = "rgb(0, 0, 255)",
    Black = "rgb(0, 0, 0)",
    Yellow = "rgb(255, 255, 0)"
}

/**
 * Represents a Primitive Rectangle uniquely identified in the ```canvasManager``` array
 * by its readonly property ```hwnd```.
 */
class PRect {
    private _x: number;
    private _y: number;
    private _w: number;
    private _h: number;
    private _color: Color;
    private _hwnd: number;
    private _style: Style;

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
    constructor(x: number, y: number, w: number, h: number, color: Color, style: Style) {
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

    /** X-coordinate of the top-left corner of the Rectangle */
    public set x(val: number) { this._x = val; requestRedraw(); }

    /** Y-coordinate of the top-left corner of the Rectangle */
    public set y(val: number) { this._y = val; requestRedraw(); }
    
    /** Width of the Rectangle */
    public set w(val: number) { this._w = val; requestRedraw(); }

    /** Height of the Rectangle */
    public set h(val: number) { this._h = val; requestRedraw(); }

    /** Color of the Rectangle. The way this property will be used depends on the ```style``` property. */
    public set color(val: Color) { this._color = val; requestRedraw(); }

    /** Whether to fill the shape with a solid color (```Fill```) or just draw the outline (```stroke```) */
    public set style(val: Style) { this._style = val; requestRedraw(); }

    /** X-coordinate of the top-left corner of the Rectangle */
    public get x(): number { return this._x; }

    /** Y-coordinate of the top-left corner of the Rectangle */
    public get y(): number { return this._y; }

    /** Height of the Rectangle */
    public get h(): number { return this._h; }

    /** Width of the Rectangle */
    public get w(): number { return this._w; }

    /** Color of the Rectangle. The way this property will be used depends on the ```style``` property. */
    public get color(): Color { return this._color; }

    /** Whether to fill the shape with a solid color (```Fill```) or just draw the outline (```stroke```) */
    public get style(): Style { return this._style; }

    /** **Readonly** Index of this Rectangle in the ```canvasManager``` array.
     *  It can be used like a pointer to this instance of the Rectangle.
     */
    public get hwnd(): number { return this._hwnd; }

    /** CanvasAPI instructions specifying how to actually draw this shape on the Canvas */
    public draw() {
        if (this._style == Style.Fill) {
            canvas.fillStyle = this._color;
            canvas.fillRect(this._x, this._y, this._w, this._h);
        } else {
            canvas.strokeStyle = this._color;
            canvas.strokeRect(this._x, this._y, this._w, this._h);
        }
    }

    /**
     * Checks if a coordinate (mx, my) is inside this Rectangle
     * @param mx X coordinate
     * @param my Y coordinate
     * @returns ```true``` if (mx, my) is inside this Rectangle; ```false``` otherwise 
     */
    public isInside(mx: number, my: number): boolean {
        return this._x <= mx && this._y <= my && mx <= this._x + this._w && my <= this._y + this._h;
    } 
}


/**
 * Represents a Primitive Line uniquely identified in the ```canvasManager``` array
 * by its readonly property ```hwnd```.
 */
class PLine {
    private _xf: number;
    private _xt: number;
    private _yf: number;
    private _yt: number;
    private _color: Color;
    private _hwnd: number;

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
    constructor(xf: number, yf: number, xt: number, yt: number, color: Color) {
        this._xf = xf;
        this._yf = yf;
        this._xt = xt;
        this._yt = yt;
        this._color = color;
        this._hwnd = canvasManager.length;
        canvasManager.push(this);
        requestRedraw();
    }

    /** X coordinate of the starting point of the line. */
    public set xf(val: number) { this._xf = val; requestRedraw(); }

    /** Y coordinate of the starting point of the line. */
    public set yf(val: number) { this._yf = val; requestRedraw(); }

    /** X coordinate of the ending point of the line. */
    public set xt(val: number) { this._xt = val; requestRedraw(); }

    /** Y coordinate of the ending point of the line. */
    public set yt(val: number) { this._yt = val; requestRedraw(); }

    /** color of the line (picked from the ```Color``` enumeration) */
    public set color(val: Color) { this._color = val; requestRedraw(); }

    /** X coordinate of the starting point of the line. */
    public get xf(): number { return this._xf; }

    /** Y coordinate of the starting point of the line. */
    public get yf(): number { return this._yf; }

    /** X coordinate of the ending point of the line. */
    public get xt(): number { return this._xt; }
    
    /** Y coordinate of the ending point of the line. */
    public get yt(): number { return this._yt; }

    /** color of the line (picked from the ```Color``` enumeration) */
    public get color(): Color { return this._color; }

    /** **Readonly** Index of this Line in the ```canvasManager``` array.
     *  It can be used like a pointer to this instance of the Line.
     */
    public get hwnd(): number { return this._hwnd; }

    /** CanvasAPI instructions specifying how to actually draw this shape on the Canvas */
    public draw(): void {
        canvas.beginPath();
        canvas.strokeStyle = this._color;
        canvas.moveTo(this._xf, this._yf);
        canvas.lineTo(this._xt, this._yt);
        canvas.stroke();
        canvas.closePath();
    }

    /**
     * Checks if a coordinate (mx, my) is on this Line
     * 
     * @param mx X coordinate
     * @param my Y coordinate
     * @returns ```true``` if (mx, my) is less than or equal to 4 pixels away from this line; ```false``` otherwise 
     */
    public isInside(mx: number, my: number): boolean {
        // "distance from a point to a line" formula
        let nu: number = Math.abs((this._yt - this._yf) * mx + (this._xf - this._xt) * my + (this._xt * this._yf - this._xf * this._yt));
        let de: number = Math.sqrt((this._yt - this._yf) * (this._yt - this._yf) + (this._xf - this._xt) * (this._xf - this._xt));
        return (nu/de) <= 4;
    }
}

//console.log("PRIMITIVE.TS LOADED");


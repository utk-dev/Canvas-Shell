enum Style {
    Fill,
    Stroke
}

enum Color {
    Red = "rgb(255, 0, 0)",
    Green = "rgb(0, 255, 0)",
    Blue = "rgb(0, 0, 255)",
    Black = "rgb(0, 0, 0)",
    Yellow = "rgb(255, 255, 0)"
}

class PRect {
    private _x: number;
    private _y: number;
    private _w: number;
    private _h: number;
    private _color: Color;
    private _hwnd: number;
    private _style: Style;

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

    public set x(val: number) { this._x = val; requestRedraw(); }
    public set y(val: number) { this._y = val; requestRedraw(); }
    public set w(val: number) { this._w = val; requestRedraw(); }
    public set h(val: number) { this._h = val; requestRedraw(); }
    public set color(val: Color) { this._color = val; requestRedraw(); }
    public set style(val: Style) { this._style = val; requestRedraw(); }

    public get x(): number { return this._x; }
    public get y(): number { return this._y; }
    public get h(): number { return this._h; }
    public get w(): number { return this._w; }
    public get color(): Color { return this._color; }
    public get style(): Style { return this._style; }
    public get hwnd(): number { return this._hwnd; }

    public draw() {
        if (this._style == Style.Fill) {
            canvas.fillStyle = this._color;
            canvas.fillRect(this._x, this._y, this._w, this._h);
        } else {
            canvas.strokeStyle = this._color;
            canvas.strokeRect(this._x, this._y, this._w, this._h);
        }
    }

    public isInside(mx: number, my: number): boolean {
        return this._x <= mx && this._y <= my && mx <= this._x + this._w && my <= this._y + this._h;
    } 
}



class PLine {
    private _xf: number;
    private _xt: number;
    private _yf: number;
    private _yt: number;
    private _color: Color;
    private _hwnd: number;

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

    public set xf(val: number) { this._xf = val; requestRedraw(); }
    public set yf(val: number) { this._yf = val; requestRedraw(); }
    public set xt(val: number) { this._xt = val; requestRedraw(); }
    public set yt(val: number) { this._yt = val; requestRedraw(); }
    public set color(val: Color) { this._color = val; requestRedraw(); }

    public get xf(): number { return this._xf; }
    public get yf(): number { return this._yf; }
    public get xt(): number { return this._xt; }
    public get yt(): number { return this._yt; }
    public get color(): Color { return this._color; }
    public get hwnd(): number { return this._hwnd; }

    public draw(): void {
        canvas.beginPath();
        canvas.strokeStyle = this._color;
        canvas.moveTo(this._xf, this._yf);
        canvas.lineTo(this._xt, this._yt);
        canvas.stroke();
        canvas.closePath();
    }

    public isInside(mx: number, my: number): boolean {
        let nu: number = Math.abs((this._yt - this._yf) * mx + (this._xf - this._xt) * my + (this._xt * this._yf - this._xf * this._yt));
        let de: number = Math.sqrt((this._yt - this._yf) * (this._yt - this._yf) + (this._xf - this._xt) * (this._xf - this._xt));
        return (nu/de) <= 4;
    }
}

console.log("PRIMITIVE.TS LOADED");


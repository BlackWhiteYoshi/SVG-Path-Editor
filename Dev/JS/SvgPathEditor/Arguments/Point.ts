import Decimal, { Coordinate } from "../../Decimal/Decimal";
import { SvgPathEditor } from "../SvgPathEditor";

export class Point {
    /** "p" is shorthand for point */
    #p: Coordinate;

    #editor: SvgPathEditor;


    constructor(p: Coordinate, editor: SvgPathEditor) {
        this.#p = p;
        this.#editor = editor;
    }

    get x(): Decimal { return this.#p.x; }

    get y(): Decimal { return this.#p.y; }


    round() {
        this.#p.x = this.#p.x.toDecimalPlaces(this.#editor.roundNumber + 1);
        (this.#pDiv!.firstChild as HTMLInputElement).value = this.#p.x.toString();
        this.#pDot?.setAttribute("cx", this.#p.x.toString());
        this.#p.y = this.#p.y.toDecimalPlaces(this.#editor.roundNumber + 1);
        (this.#pDiv!.lastChild as HTMLInputElement).value = this.#p.y.toString();
        this.#pDot?.setAttribute("cy", this.#p.y.toString());
    }


    translate(x: Decimal, y: Decimal) {
        this.#p.x = this.#p.x.plus(x);
        this.#p.y = this.#p.y.plus(y);

        (this.#pDiv!.firstChild as HTMLInputElement).value = this.#p.x.toString();
        (this.#pDiv!.lastChild as HTMLInputElement).value = this.#p.y.toString();

        this.#pDot?.setAttribute("cx", this.#p.x.toString());
        this.#pDot?.setAttribute("cy", this.#p.y.toString());
    }

    rotate(cos: Decimal, sin: Decimal) {
        const x = cos.mul(this.#p.x).minus(sin.mul(this.#p.y)).toDecimalPlaces(this.#editor.roundNumber + 1);
        const y = sin.mul(this.#p.x).plus(cos.mul(this.#p.y)).toDecimalPlaces(this.#editor.roundNumber + 1);
        this.#p.x = x;
        this.#p.y = y;

        (this.#pDiv!.firstChild as HTMLInputElement).value = this.#p.x.toString();
        (this.#pDiv!.lastChild as HTMLInputElement).value = this.#p.y.toString();

        this.#pDot?.setAttribute("cx", this.#p.x.toString());
        this.#pDot?.setAttribute("cy", this.#p.y.toString());
    }

    scale(x: Decimal, y: Decimal) {
        this.#p.x = this.#p.x.mul(x);
        this.#p.y = this.#p.y.mul(y);

        (this.#pDiv!.firstChild as HTMLInputElement).value = this.#p.x.toString();
        (this.#pDiv!.lastChild as HTMLInputElement).value = this.#p.y.toString();

        this.#pDot?.setAttribute("cx", this.#p.x.toString());
        this.#pDot?.setAttribute("cy", this.#p.y.toString());
    }



    // input elements

    #pDiv: HTMLDivElement | null = null;


    /** component:
     * <div>
     *     <input>
     *     <input>
     * </div>
     */
    createInputPair(argumentDiv: HTMLDivElement) {
        this.#pDiv = document.createElement("div");
        {
            const inputX = document.createElement("input");
            {
                inputX.value = this.#p.x.toString();
                inputX.oninput = this.#oninputX;
            }
            this.#pDiv.appendChild(inputX);

            const inputY = document.createElement("input");
            {
                inputY.value = this.#p.y.toString();
                inputY.oninput = this.#oninputY;
            }
            this.#pDiv.appendChild(inputY);
        }
        argumentDiv.appendChild(this.#pDiv);
    }

    /** */
    removeInputPair() {
        const parantDiv = this.#pDiv!.parentElement as HTMLDivElement;
        parantDiv.removeChild(parantDiv.lastChild as ChildNode);
        this.#pDiv = null;
    }


    #oninputX = (event: Event) => {
        try {
            this.#p.x = new Decimal((event.target as HTMLInputElement).value);
            this.#pDot?.setAttribute("cx", this.#p.x.toString());
            this.#editor.renderPath();
        }
        catch {
            // ignore invalid user input
        }
    }

    #oninputY = (event: Event) => {
        try {
            this.#p.y = new Decimal((event.target as HTMLInputElement).value);
            this.#pDot?.setAttribute("cy", this.#p.y.toString());
            this.#editor.renderPath();
        }
        catch {
            // ignore invalid user input
        }
    }



    // circle dots

    #pDot: SVGCircleElement | null = null;


    /** component:
     * <circle cx="p.x" cy="p.y" r="circleRadius" fill="color" stroke-width="0" style="cursor: grab|grabbing;" />
     */
    createDot(colorIndex: number) {
        const colors = ["blue", "green", "yellow", "red", "purple", "brown"];
        const color = colors[colorIndex % colors.length]

        this.#pDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        {
            this.#pDot.setAttribute("cx", this.#p.x.toString());
            this.#pDot.setAttribute("cy", this.#p.y.toString());
            this.#pDot.setAttribute("r", this.#editor.circleRadius.toString());

            this.#pDot.setAttribute("fill", color);
            this.#pDot.setAttribute("stroke-width", "0");
            this.#pDot.style.cursor = "grab";

            this.#pDot.onpointerdown = this.#dotPointerDown;
        }
        this.#editor.svg.appendChild(this.#pDot);
    }

    updateDotRadius() {
        this.#pDot?.setAttribute("r", this.#editor.circleRadius.toString());
    }

    removeDot() {
        if (this.#pDot === null)
            return;

        const parantSvg = this.#pDot.parentElement!;
        parantSvg.removeChild(this.#pDot);

        this.#pDot = null;
    }


    #dragCoordinateX = 0;
    #dragCoordinateY = 0;
    #dragPoint: Coordinate = { x: new Decimal(0), y: new Decimal(0) };

    #dotPointerDown = (event: PointerEvent) => {
        this.#pDot!.style.cursor = "grabbing";
        this.#pDot!.setPointerCapture(event.pointerId);

        this.#dragCoordinateX = event.clientX;
        this.#dragPoint.x = this.#p.x;
        this.#dragCoordinateY = event.clientY;
        this.#dragPoint.y = this.#p.y;

        this.#pDot!.onpointermove = this.#dotPointerMove;
        this.#pDot!.onpointerup = this.#dotPointerUp;
    }

    #dotPointerMove = (event: PointerEvent) => {
        const dx = event.clientX - this.#dragCoordinateX;
        const dy = event.clientY - this.#dragCoordinateY;

        this.#p.x = this.#dragPoint.x.plus(new Decimal(dx / this.#editor.svg.clientWidth * this.#editor.viewBoxWidth)).toDecimalPlaces(this.#editor.roundNumber + 1);
        this.#p.y = this.#dragPoint.y.plus(new Decimal(dy / this.#editor.svg.clientHeight * this.#editor.viewBoxHeight)).toDecimalPlaces(this.#editor.roundNumber + 1);
        
        this.#pDot!.setAttribute("cx", this.#p.x.toString());
        this.#pDot!.setAttribute("cy", this.#p.y.toString());
        (this.#pDiv!.firstChild as HTMLInputElement).value = this.#p.x.toString();
        (this.#pDiv!.lastChild as HTMLInputElement).value = this.#p.y.toString();
        this.#editor.renderPath();
    }

    #dotPointerUp = (event: PointerEvent) => {
        this.#pDot!.style.cursor = "grab";
        this.#pDot!.releasePointerCapture(event.pointerId);

        this.#pDot!.onpointermove = null;
        this.#pDot!.onpointerup = null;
    }
}

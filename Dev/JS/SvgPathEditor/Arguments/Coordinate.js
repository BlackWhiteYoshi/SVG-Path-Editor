import Decimal from "../../Decimal/Decimal";
import { SvgPathEditor } from "../SvgPathEditor";

export class Coordinate {
    /** "p" is shorthand for point
     * @type {import("../../Decimal/Decimal").Coordinate}
     **/
    #p;

    /** @type {SvgPathEditor} */
    #editor;


    /**
     * @param {import("../../Decimal/Decimal").Coordinate} p
     * @param {SvgPathEditor} editor
     */
    constructor(p, editor) {
        this.#p = p;
        this.#editor = editor;
    }

    /**
     * @returns {import("../../Decimal/Decimal").Coordinate}
     */
    getValue() {
        return this.#p;
    }


    /**
     * @param {import("../../Decimal/Decimal").Decimal} x
     * @param {import("../../Decimal/Decimal").Decimal} y
     */
    translate(x, y) {
        this.#p.x = this.#p.x.plus(x);
        this.#p.y = this.#p.y.plus(y);

        /** @type {HTMLInputElement} */(/** @type {HTMLDivElement} */(this.#pDiv).firstChild).value = this.#p.x.toString();
        /** @type {HTMLInputElement} */(/** @type {HTMLDivElement} */(this.#pDiv).lastChild).value = this.#p.y.toString();

        this.#pDot?.setAttribute("cx", this.#p.x.toString());
        this.#pDot?.setAttribute("cy", this.#p.y.toString());
    }

    /**
     * @param {import("../../Decimal/Decimal").Decimal} cos
     * @param {import("../../Decimal/Decimal").Decimal} sin
     */
    rotate(cos, sin) {
        const x = cos.mul(this.#p.x).minus(sin.mul(this.#p.y)).toDecimalPlaces(this.#editor.roundNumber + 1);
        const y = sin.mul(this.#p.x).plus(cos.mul(this.#p.y)).toDecimalPlaces(this.#editor.roundNumber + 1);
        this.#p.x = x;
        this.#p.y = y;

        /** @type {HTMLInputElement} */(/** @type {HTMLDivElement} */(this.#pDiv).firstChild).value = this.#p.x.toString();
        /** @type {HTMLInputElement} */(/** @type {HTMLDivElement} */(this.#pDiv).lastChild).value = this.#p.y.toString();

        this.#pDot?.setAttribute("cx", this.#p.x.toString());
        this.#pDot?.setAttribute("cy", this.#p.y.toString());
    }

    /**
     * @param {import("../../Decimal/Decimal").Decimal} x
     * @param {import("../../Decimal/Decimal").Decimal} y
     */
    scale(x, y) {
        this.#p.x = this.#p.x.mul(x);
        this.#p.y = this.#p.y.mul(y);

        /** @type {HTMLInputElement} */(/** @type {HTMLDivElement} */(this.#pDiv).firstChild).value = this.#p.x.toString();
        /** @type {HTMLInputElement} */(/** @type {HTMLDivElement} */(this.#pDiv).lastChild).value = this.#p.y.toString();

        this.#pDot?.setAttribute("cx", this.#p.x.toString());
        this.#pDot?.setAttribute("cy", this.#p.y.toString());
    }



    // input elements

    /** @type {HTMLDivElement | null} */
    #pDiv = null;


    /** component:
     * <div>
     *     <input>
     *     <input>
     * </div>
     * @param {HTMLDivElement} argumentDiv
     */
    createInputPair(argumentDiv) {
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
        const parantDiv = /** @type {HTMLDivElement} */(/** @type {HTMLDivElement} */(this.#pDiv).parentElement);
        parantDiv.removeChild(/** @type {ChildNode} */(parantDiv.lastChild));
        this.#pDiv = null;
    }


    /** @param {Event} event */
    #oninputX = (event) => {
        try {
            this.#p.x = new Decimal(/** @type {HTMLInputElement} */(event.target).value);
            this.#pDot?.setAttribute("cx", this.#p.x.toString());
            this.#editor.renderPath();
        }
        catch {
            // ignore invalid user input
        }
    }

    /** @param {Event} event */
    #oninputY = (event) => {
        try {
            this.#p.y = new Decimal(/** @type {HTMLInputElement} */(event.target).value);
            this.#pDot?.setAttribute("cy", this.#p.y.toString());
            this.#editor.renderPath();
        }
        catch {
            // ignore invalid user input
        }
    }



    // circle dots

    /** @type {SVGCircleElement | null} */
    #pDot = null;


    /** component:
     * <circle cx="p.x" cy="p.y" r="circleRadius" fill="color" stroke-width="0" style="cursor: grab|grabbing;" />
     * @param {number} colorIndex
     */
    createDot(colorIndex) {
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

    /** */
    updateDotRadius() {
        this.#pDot?.setAttribute("r", this.#editor.circleRadius.toString());
    }

    /** */
    removeDot() {
        if (this.#pDot === null)
            return;

        const parantSvg = /** @type {HTMLElement} */(this.#pDot.parentElement);
        parantSvg.removeChild(this.#pDot);

        this.#pDot = null;
    }


    #dragCoordinateX = 0;
    #dragCoordinateY = 0;

    /** @param {PointerEvent} event */
    #dotPointerDown = (event) => {
        /** @type {SVGCircleElement} */(this.#pDot).style.cursor = "grabbing";
        /** @type {SVGCircleElement} */(this.#pDot).setPointerCapture(event.pointerId);

        this.#dragCoordinateX = event.clientX;
        this.#dragCoordinateY = event.clientY;

        /** @type {SVGCircleElement} */(this.#pDot).onpointermove = this.#dotPointerMove;
        /** @type {SVGCircleElement} */(this.#pDot).onpointerup = this.#dotPointerUp;
    }

    /** @param {PointerEvent} event */
    #dotPointerMove = (event) => {
        const dx = event.clientX - this.#dragCoordinateX;
        const dy = event.clientY - this.#dragCoordinateY;
        this.#dragCoordinateX = event.clientX;
        this.#dragCoordinateY = event.clientY;

        this.#p.x = this.#p.x.plus(new Decimal(dx / this.#editor.svg.clientWidth * this.#editor.viewBoxWidth)).toDecimalPlaces(this.#editor.roundNumber + 1);
        this.#p.y = this.#p.y.plus(new Decimal(dy / this.#editor.svg.clientHeight * this.#editor.viewBoxHeight)).toDecimalPlaces(this.#editor.roundNumber + 1);

        /** @type {SVGCircleElement} */(this.#pDot).setAttribute("cx", this.#p.x.toString());
        /** @type {SVGCircleElement} */(this.#pDot).setAttribute("cy", this.#p.y.toString());
        /** @type {HTMLInputElement} */(/** @type {HTMLDivElement} */(this.#pDiv).firstChild).value = this.#p.x.toString();
        /** @type {HTMLInputElement} */(/** @type {HTMLDivElement} */(this.#pDiv).lastChild).value = this.#p.y.toString();
        this.#editor.renderPath();
    }

    /** @param {PointerEvent} event */
    #dotPointerUp = (event) => {
        /** @type {SVGCircleElement} */(this.#pDot).style.cursor = "grab";
        /** @type {SVGCircleElement} */(this.#pDot).releasePointerCapture(event.pointerId);

        /** @type {SVGCircleElement} */(this.#pDot).onpointermove = null;
        /** @type {SVGCircleElement} */(this.#pDot).onpointerup = null;
    }
}

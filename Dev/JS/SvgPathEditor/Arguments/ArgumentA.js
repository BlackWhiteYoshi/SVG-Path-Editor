import { SvgPathEditor } from "../SvgPathEditor";
import { Coordinate } from "./Coordinate";
import Decimal from "../../Decimal/Decimal";

export class ArgumentA {
    /** @type {Coordinate} */
    #radius;

    /** @type {import("../../Decimal/Decimal").Decimal} */
    #xAxisRotation

    /** @type {boolean} */
    #largeArcFlag

    /** @type {boolean} */
    #sweepFlag

    /** @type {Coordinate} */
    #position;


    /** @type {SvgPathEditor} */
    #editor;


    /**
     * @param {import("../../Decimal/Decimal").Coordinate} radius
     * @param {import("../../Decimal/Decimal").Decimal} xAxisRotation
     * @param {boolean} largeArcFlag
     * @param {boolean} sweepFlag
     * @param {import("../../Decimal/Decimal").Coordinate} position
     * @param {SvgPathEditor} editor
     */
    constructor(radius, xAxisRotation, largeArcFlag, sweepFlag, position, editor) {
        this.#radius = new Coordinate(radius, editor);
        this.#xAxisRotation = xAxisRotation;
        this.#largeArcFlag = largeArcFlag;
        this.#sweepFlag = sweepFlag;
        this.#position = new Coordinate(position, editor);
        this.#editor = editor;
    }


    /** @returns {string} */
    getCapitalLetter() { return 'A'; }

    /** @returns {string} */
    getSmallLetter() { return 'a'; }


    /**
     * @param {import("../../Decimal/Decimal").Decimal} x
     * @param {import("../../Decimal/Decimal").Decimal} y
     */
    translate(x, y) {
        this.#position.translate(x, y);
    }

    /**
     * @param {import("../../Decimal/Decimal").Decimal} cos
     * @param {import("../../Decimal/Decimal").Decimal} sin
     */
    rotate(cos, sin) {
        this.#position.rotate(cos, sin);
    }

    /**
     * @param {import("../../Decimal/Decimal").Decimal} x
     * @param {import("../../Decimal/Decimal").Decimal} y
     */
    scale(x, y) {
        this.#radius.scale(x, y);
        this.#position.scale(x, y);
    }


    /**
     * @param {import("../../Decimal/Decimal").Coordinate} current
     * @param {import("../../Decimal/Decimal").Coordinate} start
     * @returns {string}
     */
    toAbsoluteCoordinates(current, start) {
        current.x = this.#position.getValue().x;
        current.y = this.#position.getValue().y;
        return `A ${this.#radius.getValue().x} ${this.#radius.getValue().y} ${this.#xAxisRotation} ${this.#largeArcFlag ? 1 : 0} ${this.#sweepFlag ? 1 : 0} ${this.#position.getValue().x} ${this.#position.getValue().y} `;
    }

    /**
     * @param {import("../../Decimal/Decimal").Coordinate} current
     * @param {import("../../Decimal/Decimal").Coordinate} start
     * @returns {string}
     */
    toRelativeCoordinates(current, start) {
        const result = `a ${this.#radius.getValue().x} ${this.#radius.getValue().y} ${this.#xAxisRotation} ${this.#largeArcFlag ? 1 : 0} ${this.#sweepFlag ? 1 : 0} ${this.#position.getValue().x.minus(current.x)} ${this.#position.getValue().y.minus(current.y)} `;

        current.x = this.#position.getValue().x;
        current.y = this.#position.getValue().y;

        return result;
    }

    /**
     * @param {import("../../Decimal/Decimal").Coordinate} current
     * @param {import("../../Decimal/Decimal").Coordinate} start
     * @param {{argument: string, hasDot: boolean}} last
     * @returns {string}
     */
    toMinCoordinates(current, start, last) {
        /** @type {boolean} */
        let lastHasDot;

        /**
         * @param {Decimal} value
         * @returns {string}
         */
        function ToMinimizedString(value) {
            if (value.isZero()) {
                lastHasDot = false;
                return " 0";
            }

            let result = value.toString();
            if (value.greaterThan(0)) {
                if (value.lessThan(1)) {
                    result = result.substring(1);   // remove leading ' 0'
                    if (!lastHasDot)
                        result = ` ${result}` // add space
                }
                else
                    result = ` ${result}`; // add space
            }
            else {
                // is minus -> no space
                if (value.greaterThan(-1))
                    result = `-${result.substring(2)}` // remove second character: '0'
            }

            lastHasDot = result.includes('.');
            return result;
        }


        const radiusX_minimized = ToMinimizedString(this.#radius.getValue().x);
        const radiusY_minimized = ToMinimizedString(this.#radius.getValue().y);
        const xAxisRotation_minimized = ToMinimizedString(this.#xAxisRotation);
        const largeArcFlagString = ` ${this.#largeArcFlag ? 1 : 0}`;
        const sweepFlagString = ` ${this.#sweepFlag ? 1 : 0}`;

        lastHasDot = last.hasDot;
        let resultBig = "";
        {
            if (last.argument !== 'A')
                resultBig += 'A';

            if (last.argument !== 'A' && radiusX_minimized.charAt(0) === ' ')
                resultBig += radiusX_minimized.substring(1);
            else
                resultBig += radiusX_minimized;

            resultBig += radiusY_minimized;

            resultBig += xAxisRotation_minimized;

            resultBig += largeArcFlagString;
            resultBig += sweepFlagString;
            last.hasDot = false;

            resultBig += ToMinimizedString(this.#position.getValue().x);
            resultBig += ToMinimizedString(this.#position.getValue().y);
        }
        const lastHasDotBig = lastHasDot;

        lastHasDot = last.hasDot;
        let resultSmall = "";
        {
            if (last.argument !== 'a')
                resultSmall += 'a';

            if (last.argument !== 'a' && radiusX_minimized.charAt(0) === ' ')
                resultSmall += radiusX_minimized.substring(1);
            else
                resultSmall += radiusX_minimized;

            resultSmall += radiusY_minimized;

            resultSmall += xAxisRotation_minimized;

            resultSmall += largeArcFlagString;
            resultSmall += sweepFlagString;
            last.hasDot = false;

            resultSmall += ToMinimizedString(this.#position.getValue().x.minus(current.x));
            resultSmall += ToMinimizedString(this.#position.getValue().y.minus(current.y));
        }
        const lastHasDotSmall = lastHasDot;
        
        current.x = this.#position.getValue().x;
        current.y = this.#position.getValue().y;

        if (resultBig.length <= resultSmall.length) {
            last.argument = 'A';
            last.hasDot = lastHasDotBig;
            return resultBig;
        }
        else {
            last.argument = 'a';
            last.hasDot = lastHasDotSmall;
            return resultSmall;
        }
    }

    roundCoordinates() {
        this.#radius.round();
        this.#xAxisRotation = this.#xAxisRotation.toDecimalPlaces(this.#editor.roundNumber + 1);
        /** @type {HTMLInputElement} */(/** @type {HTMLDivElement} */(this.#inputDiv).firstChild).value = this.#xAxisRotation.toString();
        this.#position.round();
    }


    // input elements

    /** @type {HTMLDivElement | null} */
    #inputDiv = null;

    /** @param {HTMLDivElement} argumentDiv */
    createInputs(argumentDiv) {
        this.#radius.createInputPair(argumentDiv);

        this.#inputDiv = document.createElement("div");
        {
            const inputXAxisRotation = document.createElement("input");
            {
                inputXAxisRotation.value = this.#xAxisRotation.toString();
                inputXAxisRotation.oninput = this.#onInputXAxisRotation;
            }
            this.#inputDiv.appendChild(inputXAxisRotation);

            const inputLargeArcFlag = document.createElement("input");
            {
                inputLargeArcFlag.type = "checkbox";
                inputLargeArcFlag.checked = this.#largeArcFlag;
                inputLargeArcFlag.oninput = this.#onInputLargeArcFlag;
            }
            this.#inputDiv.appendChild(inputLargeArcFlag);

            const inputSweepFlag = document.createElement("input");
            {
                inputSweepFlag.type = "checkbox";
                inputSweepFlag.checked = this.#sweepFlag;
                inputSweepFlag.oninput = this.#onInputSweepFlag;
            }
            this.#inputDiv.appendChild(inputSweepFlag);
        }
        argumentDiv.appendChild(this.#inputDiv);

        this.#position.createInputPair(argumentDiv);
    }

    /** */
    removeInputs() {
        this.#position.removeInputPair();

        const parantDiv = /** @type {HTMLDivElement} */(/** @type {HTMLDivElement} */(this.#inputDiv).parentElement);
        parantDiv.removeChild(/** @type {ChildNode} */(parantDiv.lastChild));
        this.#inputDiv = null;

        this.#radius.removeInputPair();
    }

    /** @param {Event} event */
    #onInputXAxisRotation = (event) => {
        try {
            this.#xAxisRotation = new Decimal(/** @type {HTMLInputElement} */(event.target).value);
            this.#editor.renderPath();
        }
        catch {
            // ignore invalid user input
        }
    };

    /** @param {Event} event */
    #onInputLargeArcFlag = (event) => {
        this.#largeArcFlag = /** @type {HTMLInputElement} */(event.target).checked;
        this.#editor.renderPath();
    };

    /** @param {Event} event */
    #onInputSweepFlag = (event) => {
        this.#sweepFlag = /** @type {HTMLInputElement} */(event.target).checked;
        this.#editor.renderPath();
    }


    /** */
    createDots() {
        this.#radius.createDot(1);
        this.#position.createDot(0);
    }

    /** */
    updateDotsRadius() {
        this.#radius.updateDotRadius();
        this.#position.updateDotRadius();
    }

    /** */
    removeDots() {
        this.#position.removeDot();
        this.#radius.removeDot();
    }
}

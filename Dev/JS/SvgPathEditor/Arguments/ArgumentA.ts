import { SvgPathEditor } from "../SvgPathEditor";
import { Point } from "./Point";
import Decimal, { Coordinate } from "../../Decimal/Decimal";

export class ArgumentA {
    #radius: Point;
    #xAxisRotation: Decimal;
    #largeArcFlag: boolean;
    #sweepFlag: boolean;
    #position: Point;

    #editor: SvgPathEditor;

    constructor(radius: Coordinate, xAxisRotation: Decimal, largeArcFlag: boolean, sweepFlag: boolean, position: Coordinate, editor: SvgPathEditor) {
        this.#radius = new Point(radius, editor);
        this.#xAxisRotation = xAxisRotation;
        this.#largeArcFlag = largeArcFlag;
        this.#sweepFlag = sweepFlag;
        this.#position = new Point(position, editor);
        this.#editor = editor;
    }


    get capitalLetter(): string { return 'A'; }

    get smallLetter(): string { return 'a'; }


    translate(x: Decimal, y: Decimal) {
        this.#position.translate(x, y);
    }

    rotate(cos: Decimal, sin: Decimal) {
        this.#position.rotate(cos, sin);
    }

    scale(x: Decimal, y: Decimal) {
        this.#radius.scale(x, y);
        this.#position.scale(x, y);
    }


    toAbsoluteCoordinates(current: Coordinate, start: Coordinate): string {
        current.x = this.#position.x;
        current.y = this.#position.y;
        return `A ${this.#radius.x} ${this.#radius.y} ${this.#xAxisRotation} ${this.#largeArcFlag ? 1 : 0} ${this.#sweepFlag ? 1 : 0} ${this.#position.x} ${this.#position.y} `;
    }

    toRelativeCoordinates(current: Coordinate, start: Coordinate): string {
        const result = `a ${this.#radius.x} ${this.#radius.y} ${this.#xAxisRotation} ${this.#largeArcFlag ? 1 : 0} ${this.#sweepFlag ? 1 : 0} ${this.#position.x.minus(current.x)} ${this.#position.y.minus(current.y)} `;

        current.x = this.#position.x;
        current.y = this.#position.y;

        return result;
    }

    toMinCoordinates(current: Coordinate, start: Coordinate, last: { argument: string, hasDot: boolean; }): string {
        let lastHasDot: boolean;

        function ToMinimizedString(value: Decimal): string {
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


        const radiusX_minimized = ToMinimizedString(this.#radius.x);
        const radiusY_minimized = ToMinimizedString(this.#radius.y);
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

            resultBig += ToMinimizedString(this.#position.x);
            resultBig += ToMinimizedString(this.#position.y);
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

            resultSmall += ToMinimizedString(this.#position.x.minus(current.x));
            resultSmall += ToMinimizedString(this.#position.y.minus(current.y));
        }
        const lastHasDotSmall = lastHasDot;
        
        current.x = this.#position.x;
        current.y = this.#position.y;

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
        (this.#inputDiv!.firstChild as HTMLInputElement).value = this.#xAxisRotation.toString();
        this.#position.round();
    }


    // input elements

    #inputDiv: HTMLDivElement | null = null;

    createInputs(argumentDiv: HTMLDivElement) {
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

    removeInputs() {
        this.#position.removeInputPair();

        const parantDiv = this.#inputDiv!.parentElement!;
        parantDiv.removeChild(parantDiv.lastChild!);
        this.#inputDiv = null;

        this.#radius.removeInputPair();
    }

    #onInputXAxisRotation = (event: Event) => {
        try {
            this.#xAxisRotation = new Decimal((event.target as HTMLInputElement).value);
            this.#editor.renderPath();
        }
        catch {
            // ignore invalid user input
        }
    };

    #onInputLargeArcFlag = (event: Event) => {
        this.#largeArcFlag = (event.target as HTMLInputElement).checked;
        this.#editor.renderPath();
    };

    #onInputSweepFlag = (event: Event) => {
        this.#sweepFlag = (event.target as HTMLInputElement).checked;
        this.#editor.renderPath();
    }


    createDots() {
        this.#radius.createDot(1);
        this.#position.createDot(0);
    }

    updateDotsRadius() {
        this.#radius.updateDotRadius();
        this.#position.updateDotRadius();
    }

    removeDots() {
        this.#position.removeDot();
        this.#radius.removeDot();
    }
}

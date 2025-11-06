import { SvgPathEditor } from "../SvgPathEditor";
import { Argument } from "./Argument";
import { Point } from "./Point";
import Decimal, { Coordinate } from "../../Decimal/Decimal";

export class ArgumentA implements Argument {
    private radius: Point;
    private xAxisRotation: Decimal;
    private largeArcFlag: boolean;
    private sweepFlag: boolean;
    private position: Point;

    private editor: SvgPathEditor;

    public constructor(radius: Coordinate, xAxisRotation: Decimal, largeArcFlag: boolean, sweepFlag: boolean, position: Coordinate, editor: SvgPathEditor) {
        this.radius = new Point(radius, editor);
        this.xAxisRotation = xAxisRotation;
        this.largeArcFlag = largeArcFlag;
        this.sweepFlag = sweepFlag;
        this.position = new Point(position, editor);
        this.editor = editor;
    }


    public get capitalLetter(): string { return 'A'; }

    public get smallLetter(): string { return 'a'; }


    public translate(x: Decimal, y: Decimal) {
        this.position.translate(x, y);
    }

    public rotate(cos: Decimal, sin: Decimal) {
        this.position.rotate(cos, sin);
    }

    public scale(x: Decimal, y: Decimal) {
        this.radius.scale(x, y);
        this.position.scale(x, y);
    }


    public toAbsoluteCoordinates(current: Coordinate, start: Coordinate): string {
        current.x = this.position.x;
        current.y = this.position.y;
        return `A ${this.radius.x} ${this.radius.y} ${this.xAxisRotation} ${this.largeArcFlag ? 1 : 0} ${this.sweepFlag ? 1 : 0} ${this.position.x} ${this.position.y} `;
    }

    public toRelativeCoordinates(current: Coordinate, start: Coordinate): string {
        const result = `a ${this.radius.x} ${this.radius.y} ${this.xAxisRotation} ${this.largeArcFlag ? 1 : 0} ${this.sweepFlag ? 1 : 0} ${this.position.x.minus(current.x)} ${this.position.y.minus(current.y)} `;

        current.x = this.position.x;
        current.y = this.position.y;

        return result;
    }

    public toMinCoordinates(current: Coordinate, start: Coordinate, last: { argument: string, hasDot: boolean; }): string {
        let lastHasDot: boolean;

        function ToMinimizedString(value: Decimal): string {
            if (value.isZero()) {
                lastHasDot = false;
                return " 0";
            }

            let result = value.toString();
            if (value.greaterThan(0)) {
                if (value.lessThan(1)) {
                    result = result.substring(1);   // remove leading '0'
                    if (!lastHasDot)
                        result = ` ${result}`; // add space
                }
                else
                    result = ` ${result}`; // add space
            }
            else {
                // is minus -> no space
                if (value.greaterThan(-1))
                    result = `-${result.substring(2)}`; // remove second character: '0'
            }

            lastHasDot = result.includes('.');
            return result;
        }

        lastHasDot = last.hasDot;
        const radiusX_minimized = ToMinimizedString(this.radius.x);
        const radiusY_minimized = ToMinimizedString(this.radius.y);
        const xAxisRotation_minimized = ToMinimizedString(this.xAxisRotation);
        const largeArcFlagString = ` ${this.largeArcFlag ? 1 : 0}`;
        const sweepFlagString = ` ${this.sweepFlag ? 1 : 0}`;
        last.hasDot = lastHasDot;

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
            lastHasDot = false;

            resultBig += ToMinimizedString(this.position.x);
            resultBig += ToMinimizedString(this.position.y);
        }
        const lastHasDotBig = lastHasDot;

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
            lastHasDot = false;

            resultSmall += ToMinimizedString(this.position.x.minus(current.x));
            resultSmall += ToMinimizedString(this.position.y.minus(current.y));
        }
        const lastHasDotSmall = lastHasDot;

        current.x = this.position.x;
        current.y = this.position.y;

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

    public roundCoordinates() {
        this.radius.round();
        this.xAxisRotation = this.xAxisRotation.toDecimalPlaces(this.editor.roundNumber + 1);
        (<HTMLInputElement>this.inputDiv!.firstChild).value = this.xAxisRotation.toString();
        this.position.round();
    }


    // input elements

    private inputDiv: HTMLDivElement | null = null;

    public createInputs(argumentDiv: HTMLDivElement) {
        this.radius.createInputPair(argumentDiv);

        this.inputDiv = document.createElement("div");
        {
            const inputXAxisRotation = document.createElement("input");
            {
                inputXAxisRotation.value = this.xAxisRotation.toString();
                inputXAxisRotation.oninput = this.onInputXAxisRotation;
            }
            this.inputDiv.appendChild(inputXAxisRotation);

            const inputLargeArcFlag = document.createElement("input");
            {
                inputLargeArcFlag.type = "checkbox";
                inputLargeArcFlag.checked = this.largeArcFlag;
                inputLargeArcFlag.oninput = this.onInputLargeArcFlag;
            }
            this.inputDiv.appendChild(inputLargeArcFlag);

            const inputSweepFlag = document.createElement("input");
            {
                inputSweepFlag.type = "checkbox";
                inputSweepFlag.checked = this.sweepFlag;
                inputSweepFlag.oninput = this.onInputSweepFlag;
            }
            this.inputDiv.appendChild(inputSweepFlag);
        }
        argumentDiv.appendChild(this.inputDiv);

        this.position.createInputPair(argumentDiv);
    }

    public removeInputs() {
        this.position.removeInputPair();

        const parantDiv = this.inputDiv!.parentElement!;
        parantDiv.lastChild!.remove();
        this.inputDiv = null;

        this.radius.removeInputPair();
    }

    private onInputXAxisRotation = (event: Event) => {
        try {
            this.xAxisRotation = new Decimal((<HTMLInputElement>event.target).value);
            this.editor.renderPath();
        }
        catch {
            // ignore invalid user input
        }
    };

    private onInputLargeArcFlag = (event: Event) => {
        this.largeArcFlag = (<HTMLInputElement>event.target).checked;
        this.editor.renderPath();
    };

    private onInputSweepFlag = (event: Event) => {
        this.sweepFlag = (<HTMLInputElement>event.target).checked;
        this.editor.renderPath();
    }


    public createDots() {
        this.radius.createDot(1);
        this.position.createDot(0);
    }

    public updateDotsRadius() {
        this.radius.updateDotRadius();
        this.position.updateDotRadius();
    }

    public removeDots() {
        this.position.removeDot();
        this.radius.removeDot();
    }
}

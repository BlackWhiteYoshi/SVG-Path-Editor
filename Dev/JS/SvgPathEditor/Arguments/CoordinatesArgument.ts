import { SvgPathEditor } from "../SvgPathEditor";
import { Point } from "./Point";
import Decimal, { Coordinate } from "../../Decimal/Decimal";

export class CoordinatesArgument {
    static newM(coordinate: Coordinate, editor: SvgPathEditor) {
        return new CoordinatesArgument('M', 'm', [coordinate], editor);
    }

    static newL(coordinate: Coordinate, editor: SvgPathEditor) {
        return new CoordinatesArgument('L', 'l', [coordinate], editor);
    }

    static newQ(coordinate1: Coordinate, coordinate: Coordinate, editor: SvgPathEditor) {
        return new CoordinatesArgument('Q', 'q', [coordinate1, coordinate], editor);
    }

    static newT(coordinate: Coordinate, editor: SvgPathEditor) {
        return new CoordinatesArgument('T', 't', [coordinate], editor);
    }

    static newC(coordinate1: Coordinate, coordinate2: Coordinate, coordinate: Coordinate, editor: SvgPathEditor) {
        return new CoordinatesArgument('C', 'c', [coordinate1, coordinate2, coordinate], editor);
    }

    static newS(coordinate1: Coordinate, coordinate: Coordinate, editor: SvgPathEditor) {
        return new CoordinatesArgument('S', 's', [coordinate1, coordinate], editor);
    }



    #coordinates: Point[];

    #capitalLetter: string;
    get capitalLetter(): string { return this.#capitalLetter }

    #smallLetter: string;
    get smallLetter(): string { return this.#smallLetter; }


    constructor(capitalLetter: string, smallLetter: string, coordinates: Coordinate[], editor: SvgPathEditor) {
        this.#capitalLetter = capitalLetter;
        this.#smallLetter = smallLetter;
        this.#coordinates = coordinates.map((coordinate) => new Point(coordinate, editor));
    }


    translate(x: Decimal, y: Decimal) {
        for (const coordinate of this.#coordinates)
            coordinate.translate(x, y);
    }

    rotate(cos: Decimal, sin: Decimal) {
        for (const coordinate of this.#coordinates)
            coordinate.rotate(cos, sin);
    }

    scale(x: Decimal, y: Decimal) {
        for (const coordinate of this.#coordinates)
            coordinate.scale(x, y);
    }


    toAbsoluteCoordinates(current: Coordinate, start: Coordinate): string {
        if (this.#capitalLetter === 'L' && this.#coordinates[0].y.equals(current.y)) {
            current.x = this.#coordinates[0].x;
            return `H ${this.#coordinates[0].x} `;
        }

        if (this.#capitalLetter === 'L' && this.#coordinates[0].x.equals(current.x)) {
            current.y = this.#coordinates[0].y;
            return `V ${this.#coordinates[0].y} `;
        }


        let result = `${this.#capitalLetter} `;
        for (const coordinate of this.#coordinates)
            result += `${coordinate.x} ${coordinate.y} `;

        current.x = this.#coordinates[this.#coordinates.length - 1].x;
        current.y = this.#coordinates[this.#coordinates.length - 1].y;

        if (this.#capitalLetter === 'M') {
            start.x = current.x;
            start.y = current.y;
        }

        return result;
    }

    toRelativeCoordinates(current: Coordinate, start: Coordinate): string {
        if (this.#capitalLetter === 'L') {
            if (this.#coordinates[0].y.equals(current.y)) {
                const result = `h ${this.#coordinates[0].x.minus(current.x)} `;
                current.x = this.#coordinates[0].x;
                return result;
            }

            if (this.#coordinates[0].x.equals(current.x)) {
                const result = `v ${this.#coordinates[0].y.minus(current.y)} `;
                current.y = this.#coordinates[0].y;
                return result;
            }
        }


        let result = `${this.#smallLetter} `;
        for (const coordinate of this.#coordinates)
            result += `${coordinate.x.minus(current.x)} ${coordinate.y.minus(current.y)} `;

        current.x = this.#coordinates[this.#coordinates.length - 1].x;
        current.y = this.#coordinates[this.#coordinates.length - 1].y;

        if (this.#capitalLetter === 'M') {
            start.x = current.x;
            start.y = current.y;
        }

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


        if (this.#capitalLetter === 'L') {
            if (this.#coordinates[0].y.equals(current.y)) {
                lastHasDot = last.hasDot;
                let resultBig = ToMinimizedString(this.#coordinates[0].x);
                if (last.argument !== 'H') {
                    if (resultBig.charAt(0) === ' ')
                        resultBig = resultBig.substring(1); // remove ' '
                    resultBig = `H${resultBig}`;
                }
                const lastHasDotBig = lastHasDot;

                lastHasDot = last.hasDot;
                let resultSmall = ToMinimizedString(this.#coordinates[0].x.minus(current.x));
                if (last.argument !== 'h') {
                    if (resultSmall.charAt(0) === ' ')
                        resultSmall = resultSmall.substring(1); // remove ' '
                    resultSmall = `h${resultSmall}`;
                }
                const lastHasDotSmall = lastHasDot;

                current.x = this.#coordinates[0].x;

                if (resultBig.length <= resultSmall.length) {
                    last.argument = 'H';
                    last.hasDot = lastHasDotBig;
                    return resultBig;
                }
                else {
                    last.argument = 'h';
                    last.hasDot = lastHasDotSmall;
                    return resultSmall;
                }
            }

            if (this.#coordinates[0].x.equals(current.x)) {
                lastHasDot = last.hasDot;
                let resultBig = ToMinimizedString(this.#coordinates[0].y);
                if (last.argument !== 'V') {
                    if (resultBig.charAt(0) === ' ')
                        resultBig = resultBig.substring(1); // remove ' '
                    resultBig = `V${resultBig}`;
                }
                const lastHasDotBig = lastHasDot;

                lastHasDot = last.hasDot;
                let resultSmall = ToMinimizedString(this.#coordinates[0].y.minus(current.y));
                if (last.argument !== 'v') {
                    if (resultSmall.charAt(0) === ' ')
                        resultSmall = resultSmall.substring(1); // remove ' '
                    resultSmall = `v${resultSmall}`;
                }
                const lastHasDotSmall = lastHasDot;

                current.y = this.#coordinates[0].y;

                if (resultBig.length <= resultSmall.length) {
                    last.argument = 'V';
                    last.hasDot = lastHasDotBig;
                    return resultBig;
                }
                else {
                    last.argument = 'v';
                    last.hasDot = lastHasDotSmall;
                    return resultSmall;
                }
            }
        }


        lastHasDot = last.hasDot;
        let resultBig = "";
        {
            for (let coordinate of this.#coordinates) {
                resultBig += ToMinimizedString(coordinate.x);
                resultBig += ToMinimizedString(coordinate.y);
            }

            if (last.argument !== this.#capitalLetter) {
                if (resultBig.charAt(0) === ' ')
                    resultBig = resultBig.substring(1); // remove ' '
                resultBig = `${this.#capitalLetter}${resultBig}`;
            }
        }
        const lastHasDotBig = lastHasDot;

        lastHasDot = last.hasDot;
        let resultSmall = "";
        {
            for (let coordinate of this.#coordinates) {
                resultSmall += ToMinimizedString(coordinate.x.minus(current.x));
                resultSmall += ToMinimizedString(coordinate.y.minus(current.y));
            }

            if (last.argument !== this.#smallLetter) {
                if (resultSmall.charAt(0) === ' ')
                    resultSmall = resultSmall.substring(1); // remove ' '
                resultSmall = `${this.#smallLetter}${resultSmall}`;
            }
        }
        const lastHasDotSmall = lastHasDot;


        current.x = this.#coordinates[this.#coordinates.length - 1].x;
        current.y = this.#coordinates[this.#coordinates.length - 1].y;

        if (this.#capitalLetter === 'M') {
            start.x = current.x;
            start.y = current.y;
        }

        if (resultBig.length <= resultSmall.length) {
            last.argument = this.#capitalLetter;
            last.hasDot = lastHasDotBig;
            return resultBig;
        }
        else {
            last.argument = this.#smallLetter;
            last.hasDot = lastHasDotSmall;
            return resultSmall;
        }
    }

    roundCoordinates() {
        for (const coordinate of this.#coordinates)
            coordinate.round();
    }


    createInputs(argumentDiv: HTMLDivElement) {
        for (let i = 0; i < this.#coordinates.length; i++)
            this.#coordinates[i].createInputPair(argumentDiv);
    }

    removeInputs() {
        for (let i = this.#coordinates.length - 1; i >= 0; i--)
            this.#coordinates[i].removeInputPair();
    }


    createDots() {
        for (let i = this.#coordinates.length - 1, j = 0; i >= 0; i--, j++)
            this.#coordinates[i].createDot(j);
    }

    updateDotsRadius() {
        for (const coordinate of this.#coordinates)
            coordinate.updateDotRadius();
    }

    removeDots() {
        for (let i = 0; i < this.#coordinates.length; i++)
            this.#coordinates[i].removeDot();
    }
}

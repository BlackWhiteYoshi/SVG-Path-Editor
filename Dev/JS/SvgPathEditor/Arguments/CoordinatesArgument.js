import { SvgPathEditor } from "../SvgPathEditor";
import { Coordinate } from "./Coordinate";
import Decimal from "../../Decimal/Decimal";

export class CoordinatesArgument {
    /**
     * @param {import("../../Decimal/Decimal").Coordinate} coordinate
     * @param {SvgPathEditor} editor
     */
    static newM(coordinate, editor) {
        return new CoordinatesArgument('M', 'm', [coordinate], editor);
    }

    /**
     * @param {import("../../Decimal/Decimal").Coordinate} coordinate
     * @param {SvgPathEditor} editor
     */
    static newL(coordinate, editor) {
        return new CoordinatesArgument('L', 'l', [coordinate], editor);
    }

    /**
     * @param {import("../../Decimal/Decimal").Coordinate} coordinate1
     * @param {import("../../Decimal/Decimal").Coordinate} coordinate
     * @param {SvgPathEditor} editor
     */
    static newQ(coordinate1, coordinate, editor) {
        return new CoordinatesArgument('Q', 'q', [coordinate1, coordinate], editor);
    }

    /**
     * @param {import("../../Decimal/Decimal").Coordinate} coordinate
     * @param {SvgPathEditor} editor
     */
    static newT(coordinate, editor) {
        return new CoordinatesArgument('T', 't', [coordinate], editor);
    }

    /**
     * @param {import("../../Decimal/Decimal").Coordinate} coordinate1
     * @param {import("../../Decimal/Decimal").Coordinate} coordinate2
     * @param {import("../../Decimal/Decimal").Coordinate} coordinate
     * @param {SvgPathEditor} editor
     */
    static newC(coordinate1, coordinate2, coordinate, editor) {
        return new CoordinatesArgument('C', 'c', [coordinate1, coordinate2, coordinate], editor);
    }

    /**
     * @param {import("../../Decimal/Decimal").Coordinate} coordinate1
     * @param {import("../../Decimal/Decimal").Coordinate} coordinate
     * @param {SvgPathEditor} editor
     */
    static newS(coordinate1, coordinate, editor) {
        return new CoordinatesArgument('S', 's', [coordinate1, coordinate], editor);
    }



    /** @type {Coordinate[]} */
    #coordinates;

    /** @type {string} */
    #capitalLetter;
    /** @returns {string} */
    getCapitalLetter() { return this.#capitalLetter }

    /** @type {string} */
    #smallLetter;
    /** @returns {string} */
    getSmallLetter() { return this.#smallLetter; }


    /**
     * @param {string} capitalLetter
     * @param {string} smallLetter
     * @param {import("../../Decimal/Decimal").Coordinate[]} coordinates
     * @param {SvgPathEditor} editor
     */
    constructor(capitalLetter, smallLetter, coordinates, editor) {
        this.#capitalLetter = capitalLetter;
        this.#smallLetter = smallLetter;
        this.#coordinates = coordinates.map((coordinate) => new Coordinate(coordinate, editor));
    }


    /**
     * @param {import("../../Decimal/Decimal").Decimal} x
     * @param {import("../../Decimal/Decimal").Decimal} y
     */
    translate(x, y) {
        for (const coordinate of this.#coordinates)
            coordinate.translate(x, y);
    }

    /**
     * @param {import("../../Decimal/Decimal").Decimal} cos
     * @param {import("../../Decimal/Decimal").Decimal} sin
     */
    rotate(cos, sin) {
        for (const coordinate of this.#coordinates)
            coordinate.rotate(cos, sin);
    }

    /**
     * @param {import("../../Decimal/Decimal").Decimal} x
     * @param {import("../../Decimal/Decimal").Decimal} y
     */
    scale(x, y) {
        for (const coordinate of this.#coordinates)
            coordinate.scale(x, y);
    }


    /**
     * @param {import("../../Decimal/Decimal").Coordinate} current
     * @returns {string}
     */
    toAbsoluteCoordinates(current) {
        if (this.#capitalLetter === 'L' && this.#coordinates[0].getValue().y.equals(current.y)) {
            current.x = this.#coordinates[0].getValue().x;
            return `H ${this.#coordinates[0].getValue().x}`;
        }

        if (this.#capitalLetter === 'L' && this.#coordinates[0].getValue().x.equals(current.x)) {
            current.y = this.#coordinates[0].getValue().y;
            return `V ${this.#coordinates[0].getValue().y}`;
        }


        let result = `${this.#capitalLetter} `;
        for (const coordinate of this.#coordinates)
            result += `${coordinate.getValue().x} ${coordinate.getValue().y} `;

        current.x = this.#coordinates[this.#coordinates.length - 1].getValue().x;
        current.y = this.#coordinates[this.#coordinates.length - 1].getValue().y;

        return result;
    }

    /**
     * @param {import("../../Decimal/Decimal").Coordinate} current
     * @param {import("../../Decimal/Decimal").Coordinate} start
     * @returns {string}
     */
    toRelativeCoordinates(current, start) {
        if (this.#capitalLetter === 'L') {
            if (this.#coordinates[0].getValue().y.equals(current.y)) {
                const result = `h ${this.#coordinates[0].getValue().x.minus(current.x)} `;
                current.x = this.#coordinates[0].getValue().x;
                return result;
            }

            if (this.#coordinates[0].getValue().x.equals(current.x)) {
                const result = `v ${this.#coordinates[0].getValue().y.minus(current.y)} `
                current.y = this.#coordinates[0].getValue().y;
                return result;
            }
        }


        let result = `${this.#smallLetter} `;
        for (const coordinate of this.#coordinates)
            result += `${coordinate.getValue().x.minus(current.x)} ${coordinate.getValue().y.minus(current.y)} `;

        current.x = this.#coordinates[this.#coordinates.length - 1].getValue().x;
        current.y = this.#coordinates[this.#coordinates.length - 1].getValue().y;

        if (this.#capitalLetter === 'M') {
            start.x = current.x;
            start.y = current.y;
        }

        return result;
    }

    /**
     * @param {import("../../Decimal/Decimal").Coordinate} current
     * @param {import("../../Decimal/Decimal").Coordinate} start
     * @param {{argument: string, hasDot: boolean}} last
     * @returns {string}
     */
    toMinCoordinates(current, start, last) {
        /**
          * @param {Decimal} value
          * @returns {string}
          */
        function ToMinimizedString(value) {
            if (value.isZero())
                return " 0";

            let result = value.toString();
            if (value.greaterThan(0)) {
                if (value.lessThan(1)) {
                    result = result.substring(1);   // remove leading ' 0'
                    if (!last.hasDot)
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

            last.hasDot = result.includes('.');
            return result;
        }


        if (this.#capitalLetter === 'L') {
            if (this.#coordinates[0].getValue().y.equals(current.y)) {
                let resultBig = ToMinimizedString(this.#coordinates[0].getValue().x);
                if (last.argument !== 'H') {
                    if (resultBig.charAt(0) === ' ')
                        resultBig = resultBig.substring(1); // remove ' '
                    resultBig = `H${resultBig}`;
                }

                let resultSmall = ToMinimizedString(this.#coordinates[0].getValue().x.minus(current.x));
                if (last.argument !== 'h') {
                    if (resultSmall.charAt(0) === ' ')
                        resultSmall = resultSmall.substring(1); // remove ' '
                    resultSmall = `h${resultSmall}`;
                }

                current.x = this.#coordinates[0].getValue().x;

                if (resultBig.length <= resultSmall.length) {
                    last.argument = 'H';
                    return resultBig;
                }
                else {
                    last.argument = 'h';
                    return resultSmall;
                }
            }

            if (this.#coordinates[0].getValue().x.equals(current.x)) {
                let resultBig = ToMinimizedString(this.#coordinates[0].getValue().y);
                if (last.argument !== 'V') {
                    if (resultBig.charAt(0) === ' ')
                        resultBig = resultBig.substring(1); // remove ' '
                    resultBig = `V${resultBig}`;
                }

                let resultSmall = ToMinimizedString(this.#coordinates[0].getValue().y.minus(current.y));
                if (last.argument !== 'v') {
                    if (resultSmall.charAt(0) === ' ')
                        resultSmall = resultSmall.substring(1); // remove ' '
                    resultSmall = `v${resultSmall}`;
                }

                current.y = this.#coordinates[0].getValue().y;

                if (resultBig.length <= resultSmall.length) {
                    last.argument = 'V';
                    return resultBig;
                }
                else {
                    last.argument = 'v';
                    return resultSmall;
                }
            }
        }


        let resultBig = "";
        {
            for (let coordinate of this.#coordinates) {
                resultBig += ToMinimizedString(coordinate.getValue().x);
                resultBig += ToMinimizedString(coordinate.getValue().y);
            }

            if (last.argument !== this.getCapitalLetter()) {
                if (resultBig.charAt(0) === ' ')
                    resultBig = resultBig.substring(1); // remove ' '
                resultBig = `${this.getCapitalLetter()}${resultBig}`;
            }
        }

        let resultSmall = "";
        {
            for (let coordinate of this.#coordinates) {
                resultSmall += ToMinimizedString(coordinate.getValue().x.minus(current.x));
                resultSmall += ToMinimizedString(coordinate.getValue().y.minus(current.y));
            }

            if (last.argument !== this.getSmallLetter()) {
                if (resultSmall.charAt(0) === ' ')
                    resultSmall = resultSmall.substring(1); // remove ' '
                resultSmall = `${this.getSmallLetter()}${resultSmall}`;
            }
        }


        current.x = this.#coordinates[this.#coordinates.length - 1].getValue().x;
        current.y = this.#coordinates[this.#coordinates.length - 1].getValue().y;

        if (this.getCapitalLetter() === 'M') {
            start.x = current.x;
            start.y = current.y;
        }

        if (resultBig.length <= resultSmall.length) {
            last.argument = this.getCapitalLetter();
            return resultBig;
        }
        else {
            last.argument = this.getSmallLetter();
            return resultSmall;
        }
    }

    roundCoordinates() {
        for (const coordinate of this.#coordinates)
            coordinate.round();
    }


    /** @param {HTMLDivElement} argumentDiv */
    createInputs(argumentDiv) {
        for (let i = 0; i < this.#coordinates.length; i++)
            this.#coordinates[i].createInputPair(argumentDiv);
    }

    /** */
    removeInputs() {
        for (let i = this.#coordinates.length - 1; i >= 0; i--)
            this.#coordinates[i].removeInputPair();
    }


    /** */
    createDots() {
        for (let i = this.#coordinates.length - 1, j = 0; i >= 0; i--, j++)
            this.#coordinates[i].createDot(j);
    }

    /** */
    updateDotsRadius() {
        for (const coordinate of this.#coordinates)
            coordinate.updateDotRadius();
    }

    /** */
    removeDots() {
        for (let i = 0; i < this.#coordinates.length; i++)
            this.#coordinates[i].removeDot();
    }
}
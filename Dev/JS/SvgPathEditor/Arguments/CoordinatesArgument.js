import { SvgPathEditor } from "../SvgPathEditor";
import { Coordinate } from "./Coordinate";
import Decimal from "../../Decimal/Decimal";

export class CoordinatesArgument {
    /**
     * @param {import("../../Decimal/Decimal").Coordinate} coordinate
     * @param {SvgPathEditor} editor
     */
    static newM(coordinate, editor) {
        return new CoordinatesArgument("M", "m", [coordinate], editor);
    }

    /**
     * @param {import("../../Decimal/Decimal").Coordinate} coordinate
     * @param {SvgPathEditor} editor
     */
    static newL(coordinate, editor) {
        return new CoordinatesArgument("L", "l", [coordinate], editor);
    }

    /**
     * @param {import("../../Decimal/Decimal").Coordinate} coordinate1
     * @param {import("../../Decimal/Decimal").Coordinate} coordinate
     * @param {SvgPathEditor} editor
     */
    static newQ(coordinate1, coordinate, editor) {
        return new CoordinatesArgument("Q", "q", [coordinate1, coordinate], editor);
    }

    /**
     * @param {import("../../Decimal/Decimal").Coordinate} coordinate
     * @param {SvgPathEditor} editor
     */
    static newT(coordinate, editor) {
        return new CoordinatesArgument("T", "t", [coordinate], editor);
    }

    /**
     * @param {import("../../Decimal/Decimal").Coordinate} coordinate1
     * @param {import("../../Decimal/Decimal").Coordinate} coordinate2
     * @param {import("../../Decimal/Decimal").Coordinate} coordinate
     * @param {SvgPathEditor} editor
     */
    static newC(coordinate1, coordinate2, coordinate, editor) {
        return new CoordinatesArgument("C", "c", [coordinate1, coordinate2, coordinate], editor);
    }

    /**
     * @param {import("../../Decimal/Decimal").Coordinate} coordinate1
     * @param {import("../../Decimal/Decimal").Coordinate} coordinate
     * @param {SvgPathEditor} editor
     */
    static newS(coordinate1, coordinate, editor) {
        return new CoordinatesArgument("S", "s", [coordinate1, coordinate], editor);
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
            current.x = this.#coordinates[this.#coordinates.length - 1].getValue().x;
            return `H ${this.#coordinates[0].getValue().x}`;
        }

        if (this.#capitalLetter === 'L' && this.#coordinates[0].getValue().x.equals(current.x)) {
            current.y = this.#coordinates[this.#coordinates.length - 1].getValue().y;
            return `V ${this.#coordinates[0].getValue().y}`;
        }


        let result = this.#capitalLetter;

        for (const coordinate of this.#coordinates)
            result += ` ${coordinate.getValue().x} ${coordinate.getValue().y} ,`;
        result = result.substring(0, result.length - 2);

        current.x = this.#coordinates[this.#coordinates.length - 1].getValue().x;
        current.y = this.#coordinates[this.#coordinates.length - 1].getValue().y;

        return result;
    }

    /**
     * @param {import("../../Decimal/Decimal").Coordinate} current
     * @returns {string}
     */
    toRelativeCoordinates(current) {
        if (this.#capitalLetter === 'L' && this.#coordinates[0].getValue().y.equals(current.y)) {
            const result = `h ${this.#coordinates[0].getValue().x.minus(current.x)}`;
            current.x = this.#coordinates[this.#coordinates.length - 1].getValue().x;
            return result;
        }

        if (this.#capitalLetter === 'L' && this.#coordinates[0].getValue().x.equals(current.x)) {
            const result = `v ${this.#coordinates[0].getValue().y.minus(current.y)}`
            current.y = this.#coordinates[this.#coordinates.length - 1].getValue().y;
            return result;
        }


        let result = this.#smallLetter;

        for (const coordinate of this.#coordinates)
            result += ` ${coordinate.getValue().x.minus(current.x)} ${coordinate.getValue().y.minus(current.y)} ,`;
        result = result.substring(0, result.length - 2);

        current.x = this.#coordinates[this.#coordinates.length - 1].getValue().x;
        current.y = this.#coordinates[this.#coordinates.length - 1].getValue().y;

        return result;
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
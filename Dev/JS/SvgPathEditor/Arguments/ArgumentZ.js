export class ArgumentZ {
    /** @returns {string} */
    get capitalLetter() { return 'Z'; }

    /** @returns {string} */
    get smallLetter() { return 'z'; }


    /**
     * @param {import("../../Decimal/Decimal").Decimal} x
     * @param {import("../../Decimal/Decimal").Decimal} y
     */
    translate(x, y) { }

    /**
     * @param {import("../../Decimal/Decimal").Decimal} cos
     * @param {import("../../Decimal/Decimal").Decimal} sin
     */
    rotate(cos, sin) { }

    /**
     * @param {import("../../Decimal/Decimal").Decimal} x
     * @param {import("../../Decimal/Decimal").Decimal} y
     */
    scale(x, y) { }


    /**
     * @param {import("../../Decimal/Decimal").Coordinate} current
     * @param {import("../../Decimal/Decimal").Coordinate} start
     * @returns {string}
     */
    toAbsoluteCoordinates(current, start) {
        current.x = start.x;
        current.y = start.y;
        return "Z ";
    }

    /**
     * @param {import("../../Decimal/Decimal").Coordinate} current
     * @param {import("../../Decimal/Decimal").Coordinate} start
     * @returns {string}
     */
    toRelativeCoordinates(current, start) {
        current.x = start.x;
        current.y = start.y;
        return "z ";
    }

    /**
     * @param {import("../../Decimal/Decimal").Coordinate} current
     * @param {import("../../Decimal/Decimal").Coordinate} start
     * @param {{argument: string, hasDot: boolean}} last
     * @returns {string}
     */
    toMinCoordinates(current, start, last) {
        if (last.argument === 'z')
            return '';

        current.x = start.x;
        current.y = start.y;
        last.argument = 'z';
        last.hasDot = false;
        return 'z';
    }

    roundCoordinates() { }


    /** @type {HTMLInputElement} */
    #dotsVisibleInput;

    /** @param {HTMLDivElement} argumentDiv */
    createInputs(argumentDiv) {
        this.#dotsVisibleInput = /** @type {HTMLInputElement} */(argumentDiv.lastChild);
        this.#dotsVisibleInput.style.display = "none";
    }

    /** */
    removeInputs() {
        this.#dotsVisibleInput.style.removeProperty("display");
    }


    /** */
    createDots() { }

    /** */
    updateDotsRadius() { }

    /** */
    removeDots() { }
}

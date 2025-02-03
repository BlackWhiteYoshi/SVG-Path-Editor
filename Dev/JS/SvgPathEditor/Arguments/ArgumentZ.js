export class ArgumentZ {
    /** @returns {string} */
    getCapitalLetter() { return 'Z'; }

    /** @returns {string} */
    getSmallLetter() { return 'z'; }


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
        return `${this.getCapitalLetter()} `;
    }

    /**
     * @param {import("../../Decimal/Decimal").Coordinate} current
     * @param {import("../../Decimal/Decimal").Coordinate} start
     * @returns {string}
     */
    toRelativeCoordinates(current, start) {
        current.x = start.x;
        current.y = start.y;
        return `${this.getSmallLetter() } `;
    }

    /**
     * @param {import("../../Decimal/Decimal").Coordinate} current
     * @param {import("../../Decimal/Decimal").Coordinate} start
     * @param {{argument: string, hasDot: boolean}} last
     * @returns {string}
     */
    toMinCoordinates(current, start, last) {
        if (last.argument === this.getSmallLetter())
            return '';

        current.x = start.x;
        current.y = start.y;
        last.argument = this.getSmallLetter();
        last.hasDot = false;
        return this.getSmallLetter();
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

export class ArgumentZ {
    /** @returns {string} */
    getCapitalLetter() { return "Z"; }

    /** @returns {string} */
    getSmallLetter() { return "z"; }


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
     * @returns {string}
     */
    toAbsoluteCoordinates(current) {
        return this.getCapitalLetter();
    }

    /**
     * @param {import("../../Decimal/Decimal").Coordinate} current
     * @returns {string}
     */
    toRelativeCoordinates(current) {
        return this.getSmallLetter();
    }


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

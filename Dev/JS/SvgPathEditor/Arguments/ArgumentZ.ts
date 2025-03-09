import Decimal, { Coordinate } from "../../Decimal/Decimal";

export class ArgumentZ {
    get capitalLetter(): string { return 'Z'; }

    get smallLetter(): string { return 'z'; }


    translate(x: Decimal, y: Decimal) { }

    rotate(cos: Decimal, sin: Decimal) { }

    scale(x: Decimal, y: Decimal) { }


    toAbsoluteCoordinates(current: Coordinate, start: Coordinate): string {
        current.x = start.x;
        current.y = start.y;
        return "Z ";
    }

    toRelativeCoordinates(current: Coordinate, start: Coordinate): string {
        current.x = start.x;
        current.y = start.y;
        return "z ";
    }

    toMinCoordinates(current: Coordinate, start: Coordinate, last: { argument: string, hasDot: boolean; }): string {
        if (last.argument === 'z')
            return '';

        current.x = start.x;
        current.y = start.y;
        last.argument = 'z';
        last.hasDot = false;
        return 'z';
    }

    roundCoordinates() { }


    #dotsVisibleInput: HTMLInputElement | null;

    createInputs(argumentDiv: HTMLDivElement) {
        this.#dotsVisibleInput = argumentDiv.lastChild as HTMLInputElement;
        this.#dotsVisibleInput.style.display = "none";
    }

    removeInputs() {
        this.#dotsVisibleInput!.style.removeProperty("display");
    }


    createDots() { }

    updateDotsRadius() { }

    removeDots() { }
}

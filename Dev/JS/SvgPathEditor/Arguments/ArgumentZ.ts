import { Argument } from "./Argument";
import Decimal, { Coordinate } from "../../Decimal/Decimal";

export class ArgumentZ implements Argument {
    public get capitalLetter(): string { return 'Z'; }

    public get smallLetter(): string { return 'z'; }


    public translate(x: Decimal, y: Decimal) { }

    public rotate(cos: Decimal, sin: Decimal) { }

    public scale(x: Decimal, y: Decimal) { }


    public toAbsoluteCoordinates(current: Coordinate, start: Coordinate): string {
        current.x = start.x;
        current.y = start.y;
        return "Z ";
    }

    public toRelativeCoordinates(current: Coordinate, start: Coordinate): string {
        current.x = start.x;
        current.y = start.y;
        return "z ";
    }

    public toMinCoordinates(current: Coordinate, start: Coordinate, last: { argument: string, hasDot: boolean; }): string {
        if (last.argument === 'z')
            return '';

        current.x = start.x;
        current.y = start.y;
        last.argument = 'z';
        last.hasDot = false;
        return 'z';
    }

    public roundCoordinates() { }


    private dotsVisibleInput: HTMLInputElement | null;

    public createInputs(argumentDiv: HTMLDivElement) {
        this.dotsVisibleInput = <HTMLInputElement>argumentDiv.lastChild;
        this.dotsVisibleInput.style.display = "none";
    }

    public removeInputs() {
        this.dotsVisibleInput!.style.removeProperty("display");
    }


    public createDots() { }

    public updateDotsRadius() { }

    public removeDots() { }
}

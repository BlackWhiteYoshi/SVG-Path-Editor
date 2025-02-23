import Decimal, { Coordinate } from "../../Decimal/Decimal";

export interface Argument {
    capitalLetter: string;

    smallLetter: string;


    translate(x: Decimal, y: Decimal): void;

    rotate(cos: Decimal, sin: Decimal): void;

    scale(x: Decimal, y: Decimal): void;


    toAbsoluteCoordinates(current: Coordinate, start: Coordinate): string;

    toRelativeCoordinates(current: Coordinate, start: Coordinate): string;

    toMinCoordinates(current: Coordinate, start: Coordinate, last: {argument: string, hasDot: boolean})

    roundCoordinates(): void;


    createInputs(argumentDiv: HTMLDivElement): void;

    removeInputs(): void;


    createDots(): void;

    updateDotsRadius(): void;

    removeDots(): void;
}

import Decimal, { Coordinate } from "../../Decimal/Decimal";

export interface Argument {
    getCapitalLetter(): string;

    getSmallLetter(): string;


    translate(x: Decimal, y: Decimal): void;

    rotate(cos: Decimal, sin: Decimal): void;

    scale(x: Decimal, y: Decimal): void;


    toAbsoluteCoordinates(current: Coordinate): string;

    toRelativeCoordinates(current: Coordinate, start: Coordinate): string;

    roundCoordinates(): void;


    createInputs(argumentDiv: HTMLDivElement): void;

    removeInputs(): void;


    createDots(): void;

    updateDotsRadius(): void;

    removeDots(): void;
}

import Decimal from "../Decimal/Decimal";
import { Argument } from "./Arguments/Argument";
import { ArgumentA } from "./Arguments/ArgumentA";
import { ArgumentZ } from "./Arguments/ArgumentZ";
import { CoordinatesArgument } from "./Arguments/CoordinatesArgument";

export class SvgPathEditor {
    #lightRadio = document.getElementById("light-radio") as HTMLInputElement;
    #darkRadio = document.getElementById("dark-radio") as HTMLInputElement;


    #readInInput = document.getElementById("read-in-input") as HTMLInputElement;
    #readInButton = document.getElementById("read-in-button") as HTMLButtonElement;
    #parsingErrorLabel = document.getElementById("parsing-error") as HTMLDivElement;

    #outputAbsoluteLabel = document.getElementById("output-absolute") as HTMLLabelElement;
    #outputRelativeLabel = document.getElementById("output-relative") as HTMLLabelElement;
    #outputMinLabel = document.getElementById("output-min") as HTMLLabelElement;
    #copyAbsoluteButton = document.getElementById("output-absolute-button") as HTMLButtonElement;
    #copyRelativeButton = document.getElementById("output-relative-button") as HTMLButtonElement;
    #copyMinButton = document.getElementById("output-min-button") as HTMLButtonElement;

    #viewBoxXInput = document.getElementById("view-box-x") as HTMLInputElement;
    #viewBoxYInput = document.getElementById("view-box-y") as HTMLInputElement;
    #viewBoxWidthInput = document.getElementById("view-box-width") as HTMLInputElement;
    #viewBoxHeightInput = document.getElementById("view-box-height") as HTMLInputElement;

    #argumentListDiv = document.getElementById("argument-list") as HTMLDivElement;
    #circleRadiusInput = document.getElementById("circle-radius-input") as HTMLInputElement;
    #decimalPointUpButton = document.getElementById("decimal-point-up") as HTMLButtonElement;
    #decimalPointDownButton = document.getElementById("decimal-point-down") as HTMLButtonElement;
    #pointsRoundingLabel = document.getElementById("points-rounding") as HTMLLabelElement;
    #pointsRoundingExecuteButton = document.getElementById("decimal-point-round") as HTMLButtonElement;
    #argumentAddButton = document.getElementById("argument-add-button") as HTMLButtonElement;
    #argumentCountLabel = document.getElementById("argument-count") as HTMLLabelElement;
    #argumentRemoveButton = document.getElementById("argument-remove-button") as HTMLButtonElement;

    #styleListDiv = document.getElementById("style-list") as HTMLDivElement;
    #styleAddButton = document.getElementById("style-add-button") as HTMLButtonElement;
    #styleCountLabel = document.getElementById("style-count") as HTMLLabelElement;
    #styleRemoveButton = document.getElementById("style-remove-button") as HTMLButtonElement;

    #translateXInput = document.getElementById("translate-x") as HTMLInputElement;
    #translateYInput = document.getElementById("translate-y") as HTMLInputElement;
    #translateButton = document.getElementById("translate-button") as HTMLButtonElement;
    #rotateInput = document.getElementById("rotate") as HTMLInputElement;
    #rotateButton = document.getElementById("rotate-button") as HTMLButtonElement;
    #scaleXInput = document.getElementById("scale-x") as HTMLInputElement;
    #scaleYInput = document.getElementById("scale-y") as HTMLInputElement;
    #scaleButton = document.getElementById("scale-button") as HTMLButtonElement;

    svg = document.getElementById("svg") as unknown as SVGElement;
    svgPath = document.getElementById("svg-path") as unknown as SVGPathElement;


    viewBoxX = -8;
    viewBoxY = -8;
    viewBoxWidth = 16;
    viewBoxHeight = 16;

    circleRadius = new Decimal(0.2);
    roundNumber = 2;


    #argumentList: Argument[] = [];

    #addArgument(argument: Argument) {
        this.#argumentList.push(argument);
        this.#argumentCountLabel.textContent = this.#argumentList.length.toString();

        /*
            <div>
                <select onchange="">
                    <option>M</option>
                    <option>L</option>
                    <option>Q</option>
                    <option>T</option>
                    <option selected>C</option>
                    <option>S</option>
                </select>
                <input type="checkbox">
                {for each coordinate}
                <div>
                    <input>
                    <input>
                </div>
                {end for}
            </div>
        */
        const div = document.createElement("div");
        {
            const select = document.createElement("select");
            {
                const optionM = document.createElement("option");
                {
                    optionM.text = "M";
                    optionM.value = "M";
                }
                select.appendChild(optionM);

                const optionL = document.createElement("option");
                {
                    optionL.text = "L";
                    optionL.value = "L";
                }
                select.appendChild(optionL);

                const optionQ = document.createElement("option");
                {
                    optionQ.text = "Q";
                    optionQ.value = "Q";
                }
                select.appendChild(optionQ);

                const optionT = document.createElement("option");
                {
                    optionT.text = "T";
                    optionT.value = "T";
                }
                select.appendChild(optionT);

                const optionC = document.createElement("option");
                {
                    optionC.text = "C";
                    optionC.value = "C";
                }
                select.appendChild(optionC);

                const optionS = document.createElement("option");
                {
                    optionS.text = "S";
                    optionS.value = "S";
                }
                select.appendChild(optionS);

                const optionA = document.createElement("option");
                {
                    optionA.text = "A";
                    optionA.value = "A";
                }
                select.appendChild(optionA);

                const optionZ = document.createElement("option");
                {
                    optionZ.text = "Z";
                    optionZ.value = "Z";
                }
                select.appendChild(optionZ);

                select.value = argument.capitalLetter;

                select.onchange = () => {
                    const index = this.#argumentList.indexOf(argument);

                    this.#argumentList[index].removeDots();
                    this.#argumentList[index].removeInputs();
                    input.checked = false;

                    switch (select.value) {
                        case 'M': argument = CoordinatesArgument.newM({ x: new Decimal(0), y: new Decimal(0) }, this); break;
                        case 'L': argument = CoordinatesArgument.newL({ x: new Decimal(0), y: new Decimal(0) }, this); break;
                        case 'Q': argument = CoordinatesArgument.newQ({ x: new Decimal(0), y: new Decimal(0) }, { x: new Decimal(0), y: new Decimal(0) }, this); break;
                        case 'T': argument = CoordinatesArgument.newT({ x: new Decimal(0), y: new Decimal(0) }, this); break;
                        case 'C': argument = CoordinatesArgument.newC({ x: new Decimal(0), y: new Decimal(0) }, { x: new Decimal(0), y: new Decimal(0) }, { x: new Decimal(0), y: new Decimal(0) }, this); break;
                        case 'S': argument = CoordinatesArgument.newS({ x: new Decimal(0), y: new Decimal(0) }, { x: new Decimal(0), y: new Decimal(0) }, this); break;
                        case 'A': argument = new ArgumentA({ x: new Decimal(0), y: new Decimal(0) }, new Decimal(0), false, false, { x: new Decimal(0), y: new Decimal(0) }, this); break;
                        case 'Z': argument = new ArgumentZ(); break;
                    };
                    argument.createInputs(div);

                    this.#argumentList[index] = argument;
                    this.renderPath();
                };
            }
            div.appendChild(select);

            const input = document.createElement("input");
            {
                input.setAttribute("type", "checkbox");
                input.onchange = () => {
                    if (input.checked)
                        argument.createDots();
                    else
                        argument.removeDots();
                }
            }
            div.appendChild(input);

            argument.createInputs(div);
        }
        this.#argumentListDiv.appendChild(div);
    }

    #removeArgument() {
        if (this.#argumentList.length === 0)
            return;

        const argument = this.#argumentList.pop()!;
        this.#argumentCountLabel.textContent = this.#argumentList.length.toString();

        this.#argumentListDiv.removeChild(this.#argumentListDiv.lastChild!);
        argument.removeDots();
    }


    #styleList: { key: string, value: string; }[] = [];

    #addStyle(style: { key: string, value: string; }) {
        this.#styleList.push(style);
        this.#styleCountLabel.textContent = this.#styleList.length.toString();

        const inputKey = document.createElement("input");
        inputKey.value = style.key;
        inputKey.oninput = (event) => {
            style.key = (event.target as HTMLInputElement).value;
            this.renderPath();
        }
        this.#styleListDiv.appendChild(inputKey);

        const inputValue = document.createElement("input");
        inputValue.value = style.value;
        inputValue.oninput = (event) => {
            style.value = (event.target as HTMLInputElement).value;
            this.renderPath();
        }
        this.#styleListDiv.appendChild(inputValue);
    }

    #removeStyle() {
        if (this.#styleList.length === 0)
            return;

        this.#styleList.pop();
        this.#styleCountLabel.textContent = this.#styleList.length.toString();

        for (let i = 0; i < 2; i++)
            this.#styleListDiv.removeChild(this.#styleListDiv.lastChild!);
    }


    constructor() {
        const theme = localStorage.getItem("theme");
        if (theme !== null)
            if (theme === "light")
                this.#lightRadio.checked = true;
            else
                this.#darkRadio.checked = true;

        this.#lightRadio.onclick = () => localStorage.setItem("theme", "light");
        this.#darkRadio.onclick = () => localStorage.setItem("theme", "dark");


        this.#viewBoxXInput.value = this.viewBoxX.toString();
        this.#viewBoxYInput.value = this.viewBoxY.toString();
        this.#viewBoxWidthInput.value = this.viewBoxWidth.toString();
        this.#viewBoxHeightInput.value = this.viewBoxHeight.toString();
        this.#circleRadiusInput.value = this.circleRadius.toString();
        this.#pointsRoundingLabel.textContent = this.roundNumber.toString();


        this.#readInButton.onclick = this.#onReadInPath;
        this.#copyAbsoluteButton.onclick = this.#onCopyToClipboardAbsolute;
        this.#copyRelativeButton.onclick = this.#onCopyToClipboardRelative;
        this.#copyMinButton.onclick = this.#onCopyToClipboardMin;

        this.#viewBoxXInput.oninput = this.#onViewBoxX;
        this.#viewBoxYInput.oninput = this.#onViewBoxY;
        this.#viewBoxWidthInput.oninput = this.#onViewBoxWidth;
        this.#viewBoxHeightInput.oninput = this.#onViewBoxHeight;

        this.#circleRadiusInput.oninput = this.#onCircleRadius;
        this.#decimalPointUpButton.onclick = this.#onDecimalPointUp;
        this.#decimalPointDownButton.onclick = this.#onDecimalPointDown;
        this.#pointsRoundingExecuteButton.onclick = this.#onPointsRoundingExecute;
        this.#argumentAddButton.onclick = this.#onArgumentAdd;
        this.#argumentRemoveButton.onclick = this.#onArgumentRemove;

        this.#styleAddButton.onclick = this.#onStyleAdd;
        this.#styleRemoveButton.onclick = this.#onStyleRemove;

        this.#translateButton.onclick = this.#onTranslate;
        this.#rotateButton.onclick = this.#onRotate;
        this.#scaleButton.onclick = this.#onScale;


        this.#addArgument(CoordinatesArgument.newM({ x: new Decimal(-5), y: new Decimal(-5) }, this));
        this.#addArgument(CoordinatesArgument.newL({ x: new Decimal(5), y: new Decimal(-5) }, this));
        this.#addArgument(CoordinatesArgument.newQ({ x: new Decimal(0), y: new Decimal(6) }, { x: new Decimal(-5), y: new Decimal(-5) }, this));
        this.#addArgument(new ArgumentZ());

        this.#addStyle({ key: "stroke", value: "#AAA" });
        this.#addStyle({ key: "stroke-width", value: "0.5" });
        this.#addStyle({ key: "fill", value: "none" });


        this.renderSvgViewBox();
        this.renderPath();
    }



    #onReadInPath = () => {
        this.#parsingErrorLabel.style.display = "none";
        this.#parsingErrorLabel.textContent = "";

        const me = this;
        const input = this.#readInInput.value;
        if (input.length === 0)
            return;

        // '<path '
        if (input.length <= 0 || input[0] !== '<')
            return renderError("At position 1: '<' expected");
        if (input.length <= 1 || input[1] !== 'p')
            return renderError("At position 2: 'p' expected");
        if (input.length <= 2 || input[2] !== 'a')
            return renderError("At position 3: 'a' expected");
        if (input.length <= 3 || input[3] !== 't')
            return renderError("At position 4: 't' expected");
        if (input.length <= 4 || input[4] !== 'h')
            return renderError("At position 5: 'h' expected");
        if (input.length <= 5 || input[5] !== ' ')
            return renderError("At position 6: ' ' expected");
        if (input.length <= 6)
            return renderError("At position 7: 'd' or 'i' expected")

        // 'id="..." '
        let parseIndex = 6;
        if (input[6] === 'i') {
            if (input.length <= 7 || input[7] !== 'd')
                return renderError("At position 8: 'd' expected");
            if (input.length <= 8 || input[8] !== '=')
                return renderError("At position 9: '=' expected");
            if (input.length <= 9 || input[9] !== '"')
                return renderError("At position 10: '\"' expected");

            parseIndex = 10;
            do {
                if (input.length <= parseIndex)
                    return renderError(`At position ${input.length + 1}: ending " expected`);
            } while (input[parseIndex++] !== '"')

            if (input.length <= parseIndex || input[parseIndex] !== ' ')
                return renderError(`At position ${parseIndex + 1}: ' ' expected`);
            parseIndex++;
        }

        // 'd="'
        if (input.length <= parseIndex || input[parseIndex] !== 'd')
            return renderError(`At position ${parseIndex + 1}: 'd' expected`);
        parseIndex++;
        if (input.length <= parseIndex || input[parseIndex] !== '=')
            return renderError(`At position ${parseIndex + 1}: '=' expected`);
        parseIndex++;
        if (input.length <= parseIndex || input[parseIndex] !== '"')
            return renderError(`At position ${parseIndex + 1}: '\"' expected`);
        parseIndex++;


        let originX = new Decimal(0);
        let originY = new Decimal(0);
        let startX = new Decimal(0);
        let startY = new Decimal(0);
        let lastArgument = '';
        const result: Argument[] = [];

        while (input.length > parseIndex && input[parseIndex] !== '"') {
            switch (input[parseIndex++]) {
                case ' ':
                case ',':
                    break;

                case 'M': parse_M(); lastArgument = 'M'; break;
                case 'm': parse_m(); lastArgument = 'm'; break;

                case 'H': parse_H(); lastArgument = 'H'; break;
                case 'h': parse_h(); lastArgument = 'h'; break;

                case 'V': parse_V(); lastArgument = 'V'; break;
                case 'v': parse_v(); lastArgument = 'v'; break;

                case 'L': parse_L(); lastArgument = 'L'; break;
                case 'l': parse_l(); lastArgument = 'l'; break;

                case 'Q': parse_Q(); lastArgument = 'Q'; break;
                case 'q': parse_q(); lastArgument = 'q'; break;

                case 'T': parse_T(); lastArgument = 'T'; break;
                case 't': parse_t(); lastArgument = 't'; break;

                case 'C': parse_C(); lastArgument = 'C'; break;
                case 'c': parse_c(); lastArgument = 'c'; break;

                case 'S': parse_S(); lastArgument = 'S'; break;
                case 's': parse_s(); lastArgument = 's'; break;

                case 'A': parse_A(); lastArgument = 'A'; break;
                case 'a': parse_a(); lastArgument = 'a'; break;

                case 'Z':
                case 'z':
                    originX = startX;
                    originY = startY;
                    result.push(new ArgumentZ());
                    lastArgument = '';
                    break;

                case '-':
                case '.':
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9': {
                    parseIndex--;
                    switch (lastArgument) {
                        case '': return renderError(`At position ${parseIndex}: unexpected '${input[parseIndex]}'`);

                        case 'M': parse_M(); lastArgument = 'M'; break;
                        case 'm': parse_m(); lastArgument = 'm'; break;

                        case 'H': parse_H(); lastArgument = 'H'; break;
                        case 'h': parse_h(); lastArgument = 'h'; break;

                        case 'V': parse_V(); lastArgument = 'V'; break;
                        case 'v': parse_v(); lastArgument = 'v'; break;

                        case 'L': parse_L(); lastArgument = 'L'; break;
                        case 'l': parse_l(); lastArgument = 'l'; break;

                        case 'Q': parse_Q(); lastArgument = 'Q'; break;
                        case 'q': parse_q(); lastArgument = 'q'; break;

                        case 'T': parse_T(); lastArgument = 'T'; break;
                        case 't': parse_t(); lastArgument = 't'; break;

                        case 'C': parse_C(); lastArgument = 'C'; break;
                        case 'c': parse_c(); lastArgument = 'c'; break;

                        case 'S': parse_S(); lastArgument = 'S'; break;
                        case 's': parse_s(); lastArgument = 's'; break;

                        case 'A': parse_A(); lastArgument = 'A'; break;
                        case 'a': parse_a(); lastArgument = 'a'; break;
                    }
                    break;
                }

                default:
                    return renderError(`At position ${parseIndex - 1}: unexpected '${input[parseIndex - 1]}'`);
            }

            if (this.#parsingErrorLabel.style.display === "block")
                return;


            function parse_M() {
                originX = new Decimal(0);
                originY = new Decimal(0);
                parse_m();
            }
            function parse_m() {
                originX = originX.plus(parseNumber());
                originY = originY.plus(parseNumber());
                startX = originX;
                startY = originY;
                result.push(CoordinatesArgument.newM({ x: new Decimal(originX), y: new Decimal(originY) }, me));
            }

            function parse_H() {
                originX = new Decimal(0);
                parse_h();
            }
            function parse_h() {
                originX = originX.plus(parseNumber());
                result.push(CoordinatesArgument.newL({ x: new Decimal(originX), y: new Decimal(originY) }, me));
            }

            function parse_V() {
                originY = new Decimal(0);
                parse_v();
            }
            function parse_v() {
                originY = originY.plus(parseNumber());
                result.push(CoordinatesArgument.newL({ x: new Decimal(originX), y: new Decimal(originY) }, me));
            }

            function parse_L() {
                originX = new Decimal(0);
                originY = new Decimal(0);
                parse_l();
            }
            function parse_l() {
                originX = originX.plus(parseNumber());
                originY = originY.plus(parseNumber());
                result.push(CoordinatesArgument.newL({ x: new Decimal(originX), y: new Decimal(originY) }, me));
            }

            function parse_Q() {
                originX = new Decimal(0);
                originY = new Decimal(0);
                parse_q();
            }
            function parse_q() {
                const x1 = originX.plus(parseNumber());
                const y1 = originY.plus(parseNumber());
                originX = originX.plus(parseNumber());
                originY = originY.plus(parseNumber());
                result.push(CoordinatesArgument.newQ({ x: new Decimal(x1), y: new Decimal(y1) }, { x: new Decimal(originX), y: new Decimal(originY) }, me));
            }

            function parse_T() {
                originX = new Decimal(0);
                originY = new Decimal(0);
                parse_t();
            }
            function parse_t() {
                originX = originX.plus(parseNumber());
                originY = originY.plus(parseNumber());
                result.push(CoordinatesArgument.newT({ x: new Decimal(originX), y: new Decimal(originY) }, me));
            }

            function parse_C() {
                originX = new Decimal(0);
                originY = new Decimal(0);
                parse_c();
            }
            function parse_c() {
                const x1 = originX.plus(parseNumber());
                const y1 = originY.plus(parseNumber());
                const x2 = originX.plus(parseNumber());
                const y2 = originY.plus(parseNumber());
                originX = originX.plus(parseNumber());
                originY = originY.plus(parseNumber());
                result.push(CoordinatesArgument.newC({ x: new Decimal(x1), y: new Decimal(y1) }, { x: new Decimal(x2), y: new Decimal(y2) }, { x: new Decimal(originX), y: new Decimal(originY) }, me));
            }

            function parse_S() {
                originX = new Decimal(0);
                originY = new Decimal(0);
                parse_s();
            }
            function parse_s() {
                const x1 = originX.plus(parseNumber());
                const y1 = originY.plus(parseNumber());
                originX = originX.plus(parseNumber());
                originY = originY.plus(parseNumber());
                result.push(CoordinatesArgument.newS({ x: new Decimal(x1), y: new Decimal(y1) }, { x: new Decimal(originX), y: new Decimal(originY) }, me));
            }

            function parse_A() {
                originX = new Decimal(0);
                originY = new Decimal(0);
                parse_a();
            }
            function parse_a() {
                const radiusX = parseNumber();
                const radiusY = parseNumber();
                const xAxisRotation = parseNumber();
                const largeArcFlag = parseFlag();
                const sweepFlag = parseFlag();
                originX = originX.plus(parseNumber());
                originY = originY.plus(parseNumber());
                result.push(new ArgumentA({ x: radiusX, y: radiusY }, xAxisRotation, largeArcFlag, sweepFlag, { x: new Decimal(originX), y: new Decimal(originY) }, me));
            }


            function parseNumber(): Decimal {
                while (true) {
                    if (input.length <= parseIndex || input[parseIndex] == '"') {
                        renderError(`Failed parsing number at position ${parseIndex + 1}`);
                        return new Decimal(0);
                    }
                    if (input[parseIndex] !== ' ' && input[parseIndex] !== ',')
                        break;
                    parseIndex++
                }

                const startIndex = parseIndex;
                let dotVisited = false;
                if (input[parseIndex] === '-')
                    parseIndex++;
                while (true) {
                    if (input.length <= parseIndex) {
                        renderError(`Failed parsing number at position ${startIndex + 1} - ${parseIndex + 1}`);
                        return new Decimal(0);
                    }

                    if (input[parseIndex] === '.')
                        if (!dotVisited) {
                            dotVisited = true;
                            parseIndex++;
                        }
                        else
                            break;
                    else if (input[parseIndex] === 'e') {
                        dotVisited = true;
                        if (parseIndex + 1 < input.length && input[parseIndex + 1] === '-')
                            parseIndex++;
                    }
                    else
                        if (input[parseIndex] !== '0'
                            && input[parseIndex] !== '1'
                            && input[parseIndex] !== '2'
                            && input[parseIndex] !== '3'
                            && input[parseIndex] !== '4'
                            && input[parseIndex] !== '5'
                            && input[parseIndex] !== '6'
                            && input[parseIndex] !== '7'
                            && input[parseIndex] !== '8'
                            && input[parseIndex] !== '9')
                            break;
                    parseIndex++;
                }

                try {
                    return new Decimal(input.substring(startIndex, parseIndex));
                }
                catch {
                    renderError(`Failed parsing number at position ${startIndex + 1} - ${parseIndex + 1}`);
                    return new Decimal(0);
                }
            }

            function parseFlag(): boolean {
                while (true) {
                    if (input.length <= parseIndex || input[parseIndex] == '"') {
                        renderError(`Failed parsing number at position ${parseIndex + 1}`);
                        return false;
                    }
                    if (input[parseIndex] !== ' ' && input[parseIndex] !== ',')
                        break;
                    parseIndex++;
                }

                if (input.length <= parseIndex) {
                    renderError(`At position ${parseIndex}: '0' or '1' expected`);
                    return false;
                }

                let result;
                switch (input[parseIndex++]) {
                    case '0': result = false; break;
                    case '1': result = true; break;
                    default:
                        renderError(`At position ${parseIndex}: '0' or '1' expected`);
                        result = false;
                        break;
                }

                return result;
            }
        }

        if (input.length <= parseIndex)
            return renderError(`At position ${input.length + 1}: ending " expected`);


        while (this.#argumentList.length > 0)
            this.#removeArgument();
        for (const argument of result)
            this.#addArgument(argument);

        this.renderPath();


        function renderError(errorMessage: string) {
            if (me.#parsingErrorLabel.style.display === "block")
                return;
            me.#parsingErrorLabel.style.display = "block";
            me.#parsingErrorLabel.textContent = errorMessage;
        }
    }

    #onCopyToClipboardAbsolute = () => {
        navigator.clipboard.writeText(this.#outputAbsoluteLabel.textContent!);
    }

    #onCopyToClipboardRelative = () => {
        navigator.clipboard.writeText(this.#outputRelativeLabel.textContent!);
    }

    #onCopyToClipboardMin = () => {
        navigator.clipboard.writeText(this.#outputMinLabel.textContent!);
    }


    #onViewBoxX = () => {
        const viewBoxValue = parseFloat(this.#viewBoxXInput.value);
        if (isNaN(viewBoxValue))
            return;

        this.viewBoxX = viewBoxValue;
        this.renderSvgViewBox();
    }

    #onViewBoxY = () => {
        const viewBoxValue = parseFloat(this.#viewBoxYInput.value);
        if (isNaN(viewBoxValue))
            return;

        this.viewBoxY = viewBoxValue;
        this.renderSvgViewBox();
    }

    #onViewBoxWidth = () => {
        const viewBoxValue = parseFloat(this.#viewBoxWidthInput.value);
        if (isNaN(viewBoxValue))
            return;

        this.viewBoxWidth = viewBoxValue;
        this.renderSvgViewBox();
    }

    #onViewBoxHeight = () => {
        const viewBoxValue = parseFloat(this.#viewBoxHeightInput.value);
        if (isNaN(viewBoxValue))
            return;

        this.viewBoxHeight = viewBoxValue;
        this.renderSvgViewBox();
    }


    #onCircleRadius = () => {
        try {
            this.circleRadius = new Decimal(this.#circleRadiusInput.value);
            for (const argument of this.#argumentList)
                argument.updateDotsRadius();
        }
        catch {
            // ignore invalid user input
        }
    }


    #onDecimalPointUp = () => {
        if (this.roundNumber >= 6)
            return;

        this.roundNumber++;
        this.#pointsRoundingLabel.textContent = this.roundNumber.toString();
    }

    #onDecimalPointDown = () => {
        if (this.roundNumber <= 1)
            return;

        this.roundNumber--;
        this.#pointsRoundingLabel.textContent = this.roundNumber.toString();
    }
    
    #onPointsRoundingExecute = () => {
        for (const argument of this.#argumentList)
            argument.roundCoordinates();

        this.renderPath();
    }


    #onArgumentAdd = () => {
        this.#addArgument(CoordinatesArgument.newM({ x: new Decimal(0), y: new Decimal(0) }, this));
        this.renderPath();
    }

    #onArgumentRemove = () => {
        if (this.#argumentList.length === 0)
            return;

        this.#removeArgument();
        this.renderPath();
    }


    #onStyleAdd = () => {
        this.#addStyle({ key: "", value: "" });
    }

    #onStyleRemove = () => {
        if (this.#styleList.length === 0)
            return;

        this.#removeStyle();
        this.renderPath();
    }


    #onTranslate = () => {
        try {
            const x = new Decimal(this.#translateXInput.value);
            const y = new Decimal(this.#translateYInput.value);

            for (const argument of this.#argumentList)
                argument.translate(x, y);
        }
        catch {
            // ignore invalid user input
        }

        this.renderPath();
    }

    #onRotate = () => {
        const rotation = parseFloat(this.#rotateInput.value);
        if (isNaN(rotation))
            return;

        /**
         * rotate matrix
         *
         * | cos a  -sin a | * | x |
         * | sin a   cos a |   | y |
         * 
         * => 
         * 
         * x = cos a * x - sin a * y
         * y = sin a * x + cos a * y
         **/
        const radian = rotation * Math.PI / 180;
        const cos = new Decimal(Math.cos(radian));
        const sin = new Decimal(Math.sin(radian));

        for (const argument of this.#argumentList)
            argument.rotate(cos, sin);

        this.renderPath();
    }

    #onScale = () => {
        try {
            const x = new Decimal(this.#scaleXInput.value);
            const y = new Decimal(this.#scaleYInput.value);

            for (const argument of this.#argumentList)
                argument.scale(x, y);
        }
        catch {
            // ignore invalid user input
        }

        this.renderPath();
    }



    /** updates the "viewBox" attribute of the "svg" element */
    renderSvgViewBox = () => {
        this.svg.setAttribute("viewBox", `${this.viewBoxX.toString()} ${this.viewBoxY.toString()} ${this.viewBoxWidth.toString()} ${this.viewBoxHeight.toString()}`);
    }

    /** updates all attributes of the "path" element and updates the output labels */
    renderPath = () => {
        const createPath = (argumentToString: (argument: Argument) => string): string => {
            let path = `<path d="`;

            for (const argument of this.#argumentList)
                path += argumentToString(argument);
            if (path[path.length - 1] === ' ')
                path = path.substring(0, path.length - 1);

            path += `" `;

            for (const style of this.#styleList)
                if (style.key !== "")
                    path += `${style.key}="${style.value}" `;

            path += `/>`;

            return path;
        }

        // absolute path
        {
            const current = { x: new Decimal(0), y: new Decimal(0) };
            const start = { x: new Decimal(0), y: new Decimal(0) };
            this.#outputAbsoluteLabel.textContent = createPath((argument) => argument.toAbsoluteCoordinates(current, start));
        }

        // relative path
        {
            const current = { x: new Decimal(0), y: new Decimal(0) };
            const start = { x: new Decimal(0), y: new Decimal(0) };
            this.#outputRelativeLabel.textContent = createPath((argument) => argument.toRelativeCoordinates(current, start));
        }

        // min path
        {
            const current = { x: new Decimal(0), y: new Decimal(0) };
            const start = { x: new Decimal(0), y: new Decimal(0) };
            const last = { argument: '', hasDot: false };
            this.#outputMinLabel.textContent = createPath((argument) => argument.toMinCoordinates(current, start, last));
        }


        // remove all attributes
        for (const attribute of this.svgPath.attributes)
            this.svgPath.removeAttribute(attribute.name);
        // set attribute "d" with absolutePath
        this.svgPath.setAttribute("d", this.#outputAbsoluteLabel.textContent.substring(9, this.#outputAbsoluteLabel.textContent.indexOf('"', 9)));
        // add other attributes
        for (const style of this.#styleList)
            if (style.key !== "")
                this.svgPath.setAttribute(style.key, style.value);
    }
}

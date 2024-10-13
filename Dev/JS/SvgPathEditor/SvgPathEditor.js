import Decimal from "../Decimal/Decimal";
import { ArgumentA } from "./Arguments/ArgumentA";
import { ArgumentZ } from "./Arguments/ArgumentZ";
import { CoordinatesArgument } from "./Arguments/CoordinatesArgument";

export class SvgPathEditor {
    #lightRadio = /** @type {HTMLInputElement} */ (document.getElementById("light-radio"));
    #darkRadio = /** @type {HTMLInputElement} */ (document.getElementById("dark-radio"));


    #readInInput = /** @type {HTMLInputElement} */ (document.getElementById("read-in-input"));
    #readInButton = /** @type {HTMLButtonElement} */ (document.getElementById("read-in-button"));
    #parsingErrorLabel = /** @type {HTMLDivElement} */ (document.getElementById("parsing-error"));

    #outputAbsoluteLabel = /** @type {HTMLLabelElement} */ (document.getElementById("output-absolute"));
    #outputRelativeLabel = /** @type {HTMLLabelElement} */ (document.getElementById("output-relative"));
    #copyAbsoluteButton = /** @type {HTMLButtonElement} */ (document.getElementById("output-absolute-button"));
    #copyRelativeButton = /** @type {HTMLButtonElement} */ (document.getElementById("output-relative-button"));

    #viewBoxXInput = /** @type {HTMLInputElement} */ (document.getElementById("view-box-x"));
    #viewBoxYInput = /** @type {HTMLInputElement} */ (document.getElementById("view-box-y"));
    #viewBoxWidthInput = /** @type {HTMLInputElement} */ (document.getElementById("view-box-width"));
    #viewBoxHeightInput = /** @type {HTMLInputElement} */ (document.getElementById("view-box-height"));

    #argumentListDiv = /** @type {HTMLDivElement} */ (document.getElementById("argument-list"));
    #circleRadiusInput = /** @type {HTMLInputElement} */ (document.getElementById("circle-radius-input"));
    #decimalPointUpButton = /** @type {HTMLButtonElement} */ (document.getElementById("decimal-point-up"));
    #decimalPointDownButton = /** @type {HTMLButtonElement} */ (document.getElementById("decimal-point-down"));
    #pointsRoundingLabel = /** @type {HTMLLabelElement} */ (document.getElementById("points-rounding"));
    #argumentAddButton = /** @type {HTMLButtonElement} */ (document.getElementById("argument-add-button"));
    #argumentCountLabel = /** @type {HTMLLabelElement} */ (document.getElementById("argument-count"));
    #argumentRemoveButton = /** @type {HTMLButtonElement} */ (document.getElementById("argument-remove-button"));

    #styleListDiv = /** @type {HTMLDivElement} */ (document.getElementById("style-list"));
    #styleAddButton = /** @type {HTMLButtonElement} */ (document.getElementById("style-add-button"));
    #styleCountLabel = /** @type {HTMLLabelElement} */ (document.getElementById("style-count"));
    #styleRemoveButton = /** @type {HTMLButtonElement} */ (document.getElementById("style-remove-button"));

    #translateXInput = /** @type {HTMLInputElement} */ (document.getElementById("translate-x"));
    #translateYInput = /** @type {HTMLInputElement} */ (document.getElementById("translate-y"));
    #translateButton = /** @type {HTMLButtonElement} */ (document.getElementById("translate-button"));
    #rotateInput = /** @type {HTMLInputElement} */ (document.getElementById("rotate"));
    #rotateButton = /** @type {HTMLButtonElement} */ (document.getElementById("rotate-button"));
    #scaleXInput = /** @type {HTMLInputElement} */ (document.getElementById("scale-x"));
    #scaleYInput = /** @type {HTMLInputElement} */ (document.getElementById("scale-y"));
    #scaleButton = /** @type {HTMLButtonElement} */ (document.getElementById("scale-button"));

    svg = /** @type {HTMLElement} */ (document.getElementById("svg"));
    svgPath = /** @type {HTMLElement} */ (document.getElementById("svg-path"));


    viewBoxX = -10;
    viewBoxY = -10;
    viewBoxWidth = 20;
    viewBoxHeight = 20;

    circleRadius = new Decimal(0.2);
    roundNumber = 2;


    /** @type {import("Arguments/Argument").Argument[]} */
    #argumentList = [];

    /** @param {import("Arguments/Argument").Argument} argument */
    #addArgument(argument) {
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

                select.value = argument.getCapitalLetter();

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

    /** */
    #removeArgument() {
        if (this.#argumentList.length === 0)
            return;

        const argument = /** @type {import("Arguments/Argument").Argument} */(this.#argumentList.pop());
        this.#argumentCountLabel.textContent = this.#argumentList.length.toString();

        this.#argumentListDiv.removeChild(/** @type {ChildNode} */(this.#argumentListDiv.lastChild));
        argument.removeDots();
    }


    /** @type {{key: string, value: string}[]} */
    #styleList = [];

    /** @param {{key: string, value: string}} style */
    #addStyle(style) {
        this.#styleList.push(style);
        this.#styleCountLabel.textContent = this.#styleList.length.toString();

        const inputKey = document.createElement("input");
        inputKey.value = style.key;
        inputKey.oninput = (event) => {
            style.key = /** @type {HTMLInputElement} */(event.target).value;
            this.renderPath();
        }
        this.#styleListDiv.appendChild(inputKey);

        const inputValue = document.createElement("input");
        inputValue.value = style.value;
        inputValue.oninput = (event) => {
            style.value = /** @type {HTMLInputElement} */(event.target).value;
            this.renderPath();
        }
        this.#styleListDiv.appendChild(inputValue);
    }

    /** */
    #removeStyle() {
        if (this.#styleList.length === 0)
            return;

        this.#styleList.pop();
        this.#styleCountLabel.textContent = this.#styleList.length.toString();

        for (let i = 0; i < 2; i++)
            this.#styleListDiv.removeChild(/** @type {ChildNode} */(this.#styleListDiv.lastChild));
    }


    /** */
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

        this.#viewBoxXInput.oninput = this.#onViewBoxX;
        this.#viewBoxYInput.oninput = this.#onViewBoxY;
        this.#viewBoxWidthInput.oninput = this.#onViewBoxWidth;
        this.#viewBoxHeightInput.oninput = this.#onViewBoxHeight;

        this.#circleRadiusInput.oninput = this.#onCircleRadius;
        this.#decimalPointUpButton.onclick = this.#onDecimalPointUp;
        this.#decimalPointDownButton.onclick = this.#onDecimalPointDown;
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



    /** */
    #onReadInPath = () => {
        this.#parsingErrorLabel.style.display = "none";
        this.#parsingErrorLabel.textContent = "";

        const input = this.#readInInput.value;
        if (input.length === 0)
            return;


        /** @param {string} errorMessage */
        const renderError = (errorMessage) => {
            if (this.#parsingErrorLabel.style.display === "block")
                return;
            this.#parsingErrorLabel.style.display = "block";
            this.#parsingErrorLabel.textContent = errorMessage;
        }

        
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
        /** @type {import("Arguments/Argument").Argument[]} */
        const result = [];

        while (input.length > parseIndex && input[parseIndex] !== '"') {
            switch (input[parseIndex++]) {
                case ' ':
                case ',':
                    break;

                case 'M':
                    originX = new Decimal(0);
                    originY = new Decimal(0);
                case 'm': {
                    originX = originX.plus(parseNumber());
                    originY = originY.plus(parseNumber());
                    result.push(CoordinatesArgument.newM({ x: new Decimal(originX), y: new Decimal(originY) }, this));
                    break;
                }

                case 'H':
                    originX = new Decimal(0);
                case 'h': {
                    originX = originX.plus(parseNumber());
                    result.push(CoordinatesArgument.newL({ x: new Decimal(originX), y: new Decimal(originY) }, this));
                    break;
                }

                case 'V':
                    originY = new Decimal(0);
                case 'v': {
                    originY = originY.plus(parseNumber());
                    result.push(CoordinatesArgument.newL({ x: new Decimal(originX), y: new Decimal(originY) }, this));
                    break;
                }

                case 'L':
                    originX = new Decimal(0);
                    originY = new Decimal(0);
                case 'l': {
                    originX = originX.plus(parseNumber());
                    originY = originY.plus(parseNumber());
                    result.push(CoordinatesArgument.newL({ x: new Decimal(originX), y: new Decimal(originY) }, this));
                    break;
                }

                case 'Q':
                    originX = new Decimal(0);
                    originY = new Decimal(0);
                case 'q': {
                    const x1 = originX.plus(parseNumber());
                    const y1 = originY.plus(parseNumber());
                    originX = originX.plus(parseNumber());
                    originY = originY.plus(parseNumber());
                    result.push(CoordinatesArgument.newQ({ x: new Decimal(x1), y: new Decimal(y1) }, { x: new Decimal(originX), y: new Decimal(originY) }, this));
                    break;
                }

                case 'T':
                    originX = new Decimal(0);
                    originY = new Decimal(0);
                case 't': {
                    originX = originX.plus(parseNumber());
                    originY = originY.plus(parseNumber());
                    result.push(CoordinatesArgument.newT({ x: new Decimal(originX), y: new Decimal(originY) }, this));
                    break;
                }

                case 'C':
                    originX = new Decimal(0);
                    originY = new Decimal(0);
                case 'c': {
                    const x1 = originX.plus(parseNumber());
                    const y1 = originY.plus(parseNumber());
                    const x2 = originX.plus(parseNumber());
                    const y2 = originY.plus(parseNumber());
                    originX = originX.plus(parseNumber());
                    originY = originY.plus(parseNumber());
                    result.push(CoordinatesArgument.newC({ x: new Decimal(x1), y: new Decimal(y1) }, { x: new Decimal(x2), y: new Decimal(y2) }, { x: new Decimal(originX), y: new Decimal(originY) }, this));
                    break;
                }

                case 'S':
                    originX = new Decimal(0);
                    originY = new Decimal(0);
                case 's': {
                    const x1 = originX.plus(parseNumber());
                    const y1 = originY.plus(parseNumber());
                    originX = originX.plus(parseNumber());
                    originY = originY.plus(parseNumber());
                    result.push(CoordinatesArgument.newS({ x: new Decimal(x1), y: new Decimal(y1) }, { x: new Decimal(originX), y: new Decimal(originY) }, this));
                    break;
                }

                case 'A':
                    originX = new Decimal(0);
                    originY = new Decimal(0);
                case 'a': {
                    const radiusX = parseNumber();
                    const radiusY = parseNumber();
                    const xAxisRotation = parseNumber();
                    const largeArcFlag = parseFlag();
                    const sweepFlag = parseFlag();
                    originX = originX.plus(parseNumber());
                    originY = originY.plus(parseNumber());
                    result.push(new ArgumentA({ x: radiusX, y: radiusY }, xAxisRotation, largeArcFlag, sweepFlag, { x: new Decimal(originX), y: new Decimal(originY) }, this));
                    break;
                }

                case 'Z':
                case 'z': {
                    result.push(new ArgumentZ());
                    break;
                }

                default:
                    return renderError(`At position ${parseIndex - 1}: unexpected '${input[parseIndex - 1]}'`);
            }

            if (this.#parsingErrorLabel.style.display === "block")
                return;


            /** @returns {Decimal} */
            function parseNumber() {
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
                while (true) {
                    if (input.length <= parseIndex) {
                        renderError(`Failed parsing number at position ${startIndex + 1} - ${parseIndex + 1}`);
                        return new Decimal(0);
                    }
                    if (input[parseIndex] === ' ' || input[parseIndex] === ',' || input[parseIndex] === '"')
                        break;
                    parseIndex++
                }

                try {
                    return new Decimal(input.substring(startIndex, parseIndex));
                }
                catch {
                    renderError(`Failed parsing number at position ${startIndex + 1} - ${parseIndex + 1}`);
                    return new Decimal(0);
                }
            }

            /** @returns {boolean} */
            function parseFlag() {
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

                if (input.length <= parseIndex || (input[parseIndex] !== ' ' && input[parseIndex] !== ',')) {
                    renderError(`At position ${parseIndex + 1}: ' ' or ',' expected`);
                    return false;
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
    }

    /** */
    #onCopyToClipboardAbsolute = () => {
        navigator.clipboard.writeText(/** @type {string} */(this.#outputAbsoluteLabel.textContent));
    }

    /** */
    #onCopyToClipboardRelative = () => {
        navigator.clipboard.writeText(/** @type {string} */(this.#outputRelativeLabel.textContent));
    }


    /** */
    #onViewBoxX = () => {
        const viewBoxValue = parseFloat(this.#viewBoxXInput.value);
        if (isNaN(viewBoxValue))
            return;

        this.viewBoxX = viewBoxValue;
        this.renderSvgViewBox();
    }

    /** */
    #onViewBoxY = () => {
        const viewBoxValue = parseFloat(this.#viewBoxYInput.value);
        if (isNaN(viewBoxValue))
            return;

        this.viewBoxY = viewBoxValue;
        this.renderSvgViewBox();
    }

    /** */
    #onViewBoxWidth = () => {
        const viewBoxValue = parseFloat(this.#viewBoxWidthInput.value);
        if (isNaN(viewBoxValue))
            return;

        this.viewBoxWidth = viewBoxValue;
        this.renderSvgViewBox();
    }

    /** */
    #onViewBoxHeight = () => {
        const viewBoxValue = parseFloat(this.#viewBoxHeightInput.value);
        if (isNaN(viewBoxValue))
            return;

        this.viewBoxHeight = viewBoxValue;
        this.renderSvgViewBox();
    }


    /** */
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


    /** */
    #onDecimalPointUp = () => {
        if (this.roundNumber >= 6)
            return;

        this.roundNumber++;
        this.#pointsRoundingLabel.textContent = this.roundNumber.toString();
    }

    /** */
    #onDecimalPointDown = () => {
        if (this.roundNumber <= 1)
            return;

        this.roundNumber--;
        this.#pointsRoundingLabel.textContent = this.roundNumber.toString();
    }


    /** */
    #onArgumentAdd = () => {
        this.#addArgument(CoordinatesArgument.newM({ x: new Decimal(0), y: new Decimal(0) }, this));
        this.renderPath();
    }

    /** */
    #onArgumentRemove = () => {
        if (this.#argumentList.length === 0)
            return;

        this.#removeArgument();
        this.renderPath();
    }


    /** */
    #onStyleAdd = () => {
        this.#addStyle({ key: "", value: "" });
    }

    /** */
    #onStyleRemove = () => {
        if (this.#styleList.length === 0)
            return;

        this.#removeStyle();
        this.renderPath();
    }


    /** */
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

    /** */
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

    /** */
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
        let absolutePath = `<path d="`;
        {
            const current = { x: new Decimal(0), y: new Decimal(0) }

            for (const argument of this.#argumentList)
                absolutePath += `${argument.toAbsoluteCoordinates(current)} `;
            absolutePath = absolutePath.substring(0, absolutePath.length - 1);

            // set arguments-part to attribute "d"
            this.svgPath.setAttribute("d", absolutePath.substring(9, absolutePath.length));

            absolutePath += `" `;

            for (const style of this.#styleList)
                if (style.key !== "")
                    absolutePath += `${style.key}="${style.value}" `;

            absolutePath += `/>`;
        }
        this.#outputAbsoluteLabel.textContent = absolutePath;

        let relativePath = `<path d="`;
        {
            const current = { x: new Decimal(0), y: new Decimal(0) }

            for (const argument of this.#argumentList)
                relativePath += `${argument.toRelativeCoordinates(current)} `;
            relativePath = relativePath.substring(0, relativePath.length - 1);

            relativePath += `" `;

            for (const style of this.#styleList)
                if (style.key !== "")
                    relativePath += `${style.key}="${style.value}" `;

            relativePath += `/>`;
        }
        this.#outputRelativeLabel.textContent = relativePath;

        // remove all attributes except "d"
        for (const attribute of this.svgPath.attributes)
            if (attribute.name !== "d")
                this.svgPath.removeAttribute(attribute.name);
        // add attributes
        for (const style of this.#styleList)
            if (style.key !== "")
                this.svgPath.setAttribute(style.key, style.value);
    }
}

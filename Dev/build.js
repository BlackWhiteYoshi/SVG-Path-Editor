#!node

/**** creates a selfcontaining html-file (css and js is inlined) ****/

/** Dependencies **/
// html-minifier-terser
// css-minify
// rspack


const fileSystem = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const execSyncParameter = { shell: true, stdio: "pipe", encoding: "utf8" };




process.chdir("JS");



console.log("--> creating optimized JS...");

// create js file
const jsResult = execSync("npx rspack build --config rspack.config.prod.mjs", execSyncParameter);
console.log("Output:\n", jsResult);

// read in js file
const jsFile = fileSystem.readFileSync("../temp.js", "utf8");

// remove js file
fileSystem.unlinkSync("../temp.js");

console.log("--> JS created\n");



console.log("--> creating optimized css...");

// create css file
const cssResult = execSync('css-minify -f ../site.css -o ../temp', execSyncParameter);
console.log("Output:\n", cssResult);

// read in css file
const cssFile = fileSystem.readFileSync("../temp/site.min.css", "utf8");

// remove css file with folder
fileSystem.unlinkSync("../temp/site.min.css");
fileSystem.rmdirSync("../temp");

console.log("--> optimized css created\n");



console.log("--> creating index.html");

// read in html file
const htmlFile = fileSystem.readFileSync("../site.html", "utf8");

// find css-tag in html file
const cssToReplace = "<link rel=\"stylesheet\" href=\"site.css\">";
const cssIndex = htmlFile.indexOf(cssToReplace);
if (cssIndex === -1) {
    console.error(`Error: cannot find '${cssToReplace}'`);
    process.exit(1);
}
const cssIndexEnd = cssIndex + cssToReplace.length;

// find js-tag in html file
const jsToReplace = "<script src=\"site.js\" defer></script>";
const jsIndex = htmlFile.indexOf(jsToReplace);
if (jsIndex === -1) {
    console.error(`Error: cannot find '${jsToReplace}'`);
    process.exit(1);
}
const jsIndexEnd = jsIndex + jsToReplace.length;

// check css-tag is before js-tag
if (cssIndex > jsIndex) {
    console.error("Error: '<link rel=\"stylesheet\" href=\"site.css\">' must be before '<script src=\"site.js\" defer></script>'");
    process.exit(1);
}

// replace css-tag and js-tag
const resultHTML = `${htmlFile.slice(0, cssIndex)}<style>${cssFile}</style>${htmlFile.slice(cssIndexEnd, jsIndex)}<script type="module">${jsFile}</script>${htmlFile.slice(jsIndexEnd)}`;

// write temp html file
fileSystem.writeFileSync("../temp.html", resultHTML, "utf8");

// create minified html file
const minifyResult = execSync('html-minifier-terser ../temp.html -o ../../svg-path-editor.html --collapse-whitespace --remove-comments', execSyncParameter);
console.log("Output:\n", minifyResult);

// remove temp html file
fileSystem.unlinkSync("../temp.html");

console.log("--> successfully created index.html");

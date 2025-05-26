# SVG-Path-Editor

[*SVG-Path-Editor* page](https://blackwhiteyoshi.github.io/SVG-Path-Editor/svg-path-editor.html)

A simple editor to create or edit an SVG path:

- It can read in SVG path (absolute, relative or mixed).
- It outputs the path as absolute path and relative path.
- You can set coordinate points directly or by dragging them with your cursor.
- You can transform (translate, rotate, scale) your path.

Sometimes you want to create a readable, optimized SVG, but doing it with just an editor can be annoying and time consuming.
This editor can help you and lets you write your SVG much quicker.
You can read in an SVG-path you want to edit, drag the points in the right directions and copy the output (absolute or relative) back in your SVG.


<br></br>
## Builds

There exists a development build and a production build.


### Development Build

The development build is located in the "/Dev/" folder. The build has 3 files:

- site.html
- site.css
- site.js

The html and css file are written directly without any extra tooling. The js file however is produced using *webpack*.
The files for generating the js file are located in the "/Dev/JS/" folder.


### Production Build

The production build is the file "svg-path-editor.html". It is self-contained.
It is build using the "/Dev/build.py" script.

The script has some dependencies to run correctly:

- python (obviously)
- html-minifier-terser
- css-minify
- rspack

It creates an optimized and minified js build, a minified css build, inlines both in the html and lastly minifies the html
and saves it as "svg-path-editor.html".

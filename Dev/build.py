##### creates a selfcontaining html-file (css and js is inlined) #####


### Dependencies

# python (obviously)
# html-minifier-terser
# css-minify
# rspack


import subprocess
import os


os.chdir("JS")

print("--> creating optimized JS...")

# create js file
result = subprocess.run(["npx", "rspack", "build", "--config", "rspack.config.prod.js"], shell = True, check = True, capture_output = True, text = True)
print("Output:\n", result.stdout)

# read in js file
with open("../temp.js", 'r') as file:
    js_file = file.read()

# remove js file
os.remove("../temp.js")

print("--> JS created\n")


print("--> creating optimized css...")

# create css file
result = subprocess.run(["css-minify", "-f", "../site.css", "-o", "../temp"], shell = True, check = True, capture_output = True, text = True)
print("Output:\n", result.stdout)

# read in css file
with open("../temp/site.min.css", 'r') as file:
    css_file = file.read()

# remove css file with folder
os.remove("../temp/site.min.css")
os.rmdir("../temp")

print("--> optimized css created\n")


print("--> creating index.html");

# read in html file
with open("../site.html", 'r') as file:
    html_file = file.read()

css_to_replace = "<link rel=\"stylesheet\" href=\"site.css\">"
css_index = html_file.find(css_to_replace)
if css_index == -1:
    print(F"Error: cannot find '{css_to_replace}'")
    exit()
css_index_end = css_index + len(css_to_replace)
    
js_to_replace = "<script src=\"site.js\" defer></script>"
js_index = html_file.find(js_to_replace)
if js_index == -1:
    print(F"Error: cannot find '{js_to_replace}'")
    exit()
js_index_end = js_index + len(js_to_replace)

if css_index > js_index:
    print("Error: '<link rel=\"stylesheet\" href=\"site.css\">' must be before '<script src=\"site.js\" defer></script>'")
    exit()

result = F"{html_file[:css_index]}<style>{css_file}</style>{html_file[css_index_end:js_index]}<script type=\"module\">{js_file}</script>{html_file[js_index_end:]}"


# write temp html file
with open("../temp.html", 'w') as file:
    file.write(result)
    
# create minified html file
result = subprocess.run(["html-minifier-terser", "../temp.html", "-o", "../../svg-path-editor.html", "--collapse-whitespace", "--remove-comments"], shell = True, check = True, capture_output = True, text = True)
print("Output:\n", result.stdout)

# remove temp html file
os.remove("../temp.html")


print("--> successfully created index.html");

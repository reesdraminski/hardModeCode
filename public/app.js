// create a CodeMirror instance
const editor = CodeMirror(document.getElementById("editor"), {
    mode: "javascript",
    lineNumbers: true,
    indentUnit: 4
});

// get problem text and generate HTML from the MD
fetch("/problem")
.then(response => response.json())
.then(data => {
    const converter = new showdown.Converter();
    converter.setFlavor('github');

    document.getElementById("problem").innerHTML = converter.makeHtml(data.problem);
});

// automatically focus on the editor when page loads
editor.focus();

// prevent people from accesing the right-click ("context") menu
document.addEventListener('contextmenu', e => e.preventDefault());

/**
* Reset the value of the CodeMirror editor instance.
*/
function reset() {
    // overwrite editor previous value with nothing
    editor.setValue("");

    // focus back on the editor
    editor.focus();
}

/**
 * Submit the code to the server to be tested.
 */
function submit() {
    // get code from CodeMirror editor
    const code = editor.getValue();
    const mode = editor.getOption("mode");

    // convert code to JSON entity for POST request
    const data = { language: mode, code: code };

    // create request object
    const request = new Request("/submit", { method: "POST", headers: new Headers({'Content-Type': 'application/json'}), body: JSON.stringify(data) });

    // send request to server
    fetch(request)
    .then(response => response.json())
    .then(data => {
        // show console errors and output
        document.getElementById("console").value = data.output;
        document.getElementById("console").value += data.error;

        // calculate test result icons
        // document.getElementById("testResults").innerHTML = "";
        // for (let test in data.testResults) {
        //     document.getElementById("testResults").innerHTML += test + ": " + (data.testResults[test].passed ? "&#10003;" : "&#10060;") + "<br>";
        // }
    });
}

/**
 * Open a tab in the drawer.
 */
function openTab(tabName) {
    // toggle tab links
    for (let el of document.getElementsByClassName("tablinks"))
        el.classList.toggle("active");

    // if output clicked, show output and hide testResults
    if (tabName == "output") {
        document.getElementById("output").style.display = "";
        document.getElementById("testResults").style.display = "none";
    }
    // if testResults clicked, show testResults and hide output
    else if (tabName == "testResults") {
        document.getElementById("testResults").style.display = "";
        document.getElementById("output").style.display = "none";
    }
}

/**
 * Listen for changes in the language selection, on a change event, change
 * the CodeMirror instance mode to allow for syntax highlighting.
 */
document.getElementById("language").addEventListener("change", (e) => {
    // get the newly selected language
    const languageChoice = e.srcElement.value;

    // convert the language select value into a CodeMirror mode value
    let mode;
    switch (languageChoice) {
        case "JavaScript":
            mode = "javascript";
            break;
        case "Python":
            mode = "python";
            break;
    }

    // change the CodeMirror instance mode
    editor.setOption("mode", mode);
});

/**
 * Disable mouse clicking within the CodeMirror editor.
 */
editor.on("mousedown", (instance, e) => {
    // focus on the editor when it get's clicked
    editor.focus();

    // do not allow any other normal click behaviors to happen
    e.preventDefault();
});

/**
 * Prevent Cmd/Ctrl and Backspace key events that would allow users to edit
 * their code.
 */
document.body.addEventListener("keydown", (e) => {
    // if Cmd/Ctrl key or backspace
    if (e.metaKey || e.which == 8 || [37, 38, 39, 40].includes(e.which)) {
        e.preventDefault();
        e.stopPropagation();
    }
}, true);
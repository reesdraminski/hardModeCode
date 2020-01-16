/**
* Setup the web application.
*/
(function setup() {
    // display code problem
    getProblem();

    // create a CodeMirror instance
    const editor = CodeMirror(document.getElementById("editor"), {
        mode: "javascript",
        lineNumbers: true,
        indentUnit: 4
    });

    // automatically focus on the editor when page loads
    editor.focus();

    // disable mouse clicks on editor
    disableEditorMouseClicks(editor);

    // prevent user from accesing the right-click ("context") menu.
    disableContextMenu();

    // disable keys that would allow user to edit their input
    disableEditingKeys();

    document.getElementById("reset").onclick = () => reset(editor);
    document.getElementById("submit").onclick = () => submit(editor);
})();

/**
* Reset the value of the CodeMirror editor instance.
*/
function reset(editor) {
    // overwrite editor previous value with nothing
    editor.setValue("");

    // focus back on the editor
    editor.focus();
}

/**
* Submit the code to the server to be tested.
*/
function submit(editor) {
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
* Get problem text and generate HTML from the MD
*/
function getProblem() {
    fetch("/problem")
    .then(response => response.json())
    .then(data => {
        const converter = new showdown.Converter();
        converter.setFlavor('github');

        document.getElementById("problem").innerHTML = converter.makeHtml(data.problem);
    });
}

/**
* Prevent user from accesing the right-click ("context") menu.
*/
function disableContextMenu() {
    document.addEventListener('contextmenu', e => e.preventDefault());
}

/**
* Prevent Cmd/Ctrl and Backspace key events that would allow users to edit
* their code.
*/
function disableEditingKeys() {
    document.body.addEventListener("keydown", (e) => {
        // if Cmd/Ctrl key or backspace
        if (e.metaKey || e.which == 8 || [37, 38, 39, 40].includes(e.which)) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
}

/**
* Disable mouse clicking within the CodeMirror editor.
*/
function disableEditorMouseClicks(editor) {
    editor.on("mousedown", (instance, e) => {
        // focus on the editor when it get's clicked
        editor.focus();

        // do not allow any other normal click behaviors to happen
        e.preventDefault();
    });
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
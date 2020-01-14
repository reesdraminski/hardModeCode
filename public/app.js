// create a CodeMirror instance
const editor = CodeMirror(document.getElementById("editor"), {
    mode: "javascript",
    lineNumbers: true,
    indentUnit: 4
});

// automatically focus on the editor when page loads
editor.focus();

/**
* Reset the value of the CodeMirror editor instance.
*/
function reset() {
    editor.setValue("");
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
        console.log(data);
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

/**
 * Prevent Cmd/Ctrl and Backspace key events that would allow users to edit
 * their code.
 */
document.getElementById("editor").addEventListener("keydown", (e) => {
    // if Cmd/Ctrl key or backspace
    if (e.metaKey || e.which == 8) {
        e.preventDefault();
        e.stopPropagation();

        return false;
    }
}, true);
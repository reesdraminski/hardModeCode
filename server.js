// user-defined constants
const PORT = 3000;
const CODE_EXECUTION_LIMIT = 5000;

// program constants
const JAVASCRIPT = "javascript";
const PYTHON = "python";

const fs = require('fs');
const child_process = require('child_process');

// express imports to create server
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

// set static asset folder and user JSON body parsers
app.use(express.static("public"));
app.use(express.json());

/**
 * Serve the web application.
 */
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

/**
 * Given a language, it will return the file extension of that language.
 * 
 * @param {String} language 
 */
function getFileExtension(language) {
    switch (language) {
        case JAVASCRIPT:
            return ".js";
        case PYTHON:
            return ".py";
    }
}

/**
 * Given a language, it will return the command required to excecute a file of 
 * that language.
 * 
 * @param {String} language 
 */
function getRunCommand(language) {
    switch (language) {
        case JAVASCRIPT:
            return "node";
        case PYTHON:
            return "python3";
    }
}

/**
 * This will execute code and provide the output, error, and exit code
 * via a callback function.
 * 
 * @param {String} command 
 * @param {[String]} args 
 * @param {Function} callback 
 */
function runCode(command, args, callback) {
    console.log("Starting code execution.");

    // start process
    const child = child_process.spawn(command, args);

    // kill process if goes over code execution limit
    const timeout = setTimeout(() => {
        console.log("Code execution killed.");

        // kill child process
        child.kill("SIGINT");

        // use callback to give data
        callback(stdout, stderr, -1);
    }, CODE_EXECUTION_LIMIT);

    // get the output of code
    let stdout = "";
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", function(data) {
        stdout += data.toString();
    });

    // get any errors from code
    let stderr = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", function(data) {
        stderr += data.toString();
    });

    // when the child process closes naturally
    child.on("close", function(code) {
        console.log("Code execution finished.");

        // clear the timeout so it doesn't try to kill the function
        clearTimeout(timeout);

        // use callback to give data
        callback(stdout, stderr, code);
    });
}

/**
 * Code Submission Endpoint
 */
app.post("/submit", (req, res) => {
    // get data from request body
    const language = req.body["language"];
    const code = req.body["code"];

    // get proper file extension depending on language
    const fileExtension = getFileExtension(language);

    // save file
    const filename = new Date().getTime() + fileExtension;
    fs.writeFileSync(filename, code);

    console.log("Saved file to " + filename);
    
    console.log("Started execution of " + filename);

    // run the file
    const runCommand = getRunCommand(language);
    runCode(runCommand, [filename], (stdout, stderr, exitCode) => {
        // remove trailing whitespace that results from reading the output stream
        if (stdout[stdout.length - 1] == "\n")
            stdout = stdout.slice(0, -1);

        // delete file after its been tested
        fs.unlinkSync(filename);

        console.log("Deleted file at " + filename);

        // send response back to frontend
        res.send({
            output: stdout,
            error: stderr
        });
    });
});

/**
 * Start the server listening at PORT number.
 */
server.listen(PORT, () => {
    console.log("Server running on http://127.0.0.1:" + PORT);
});
function startTests(fileName) {
    console.log("Starting Tests on " + fileName);

    const n_fib = require("./" + fileName);

    return {
        "Test #1": {
            passed: testOne(n_fib)
        },
        "Test #2": {
            passed: testTwo(n_fib)
        },
        "Test #3": {
            passed: testThree(n_fib)
        }
    };
}

function testOne(n_fib) {
    return n_fib(0) == 0;
}

function testTwo(n_fib) {
    return n_fib(1) == 1;
}

function testThree(n_fib) {
    return n_fib(7) == 8;
}

module.exports = startTests;
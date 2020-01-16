// flag to get file from
const FLAG = "totest";

// import mocha/chai testing functions
const assert = require("chai").assert;

// get file to test
const val = process.argv[3];
const fileName = val.substring(val.indexOf(FLAG) + FLAG.length + 1);
const n_fib = require("../../" + fileName);

// the right answer since the secret tests are random numbers to prevent hardcoding
function calculateAnswer(n) {
    if (n === 0) return 0;
    if (n == 1) return 1;

    return calculateAnswer(n - 2) + calculateAnswer(n - 1);
}

// test the n_fib() function
describe("#n_fib()", function() {
    it("n = 0 should return 0", function() {
        assert.equal(n_fib(0), 0);
    });

    it("n = 1 should return 1", function() {
        assert.equal(n_fib(1), 1);
    });

    it("n = 6 should return 8", function() {
        assert.equal(n_fib(6), 8);
    });

    it("secret test #1", function() {
        const n = 6 + Math.ceil(Math.random() * 20);

        assert.equal(n_fib(n), calculateAnswer(n));
    });

    it("secret test #2", function() {
        const n = 6 + Math.ceil(Math.random() * 20);

        assert.equal(n_fib(n), calculateAnswer(n));
    });
});
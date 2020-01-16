const FLAG = "totest";

const assert = require("chai").assert;

const val = process.argv[3];
const fileName = val.substring(val.indexOf(FLAG) + FLAG.length + 1);
const n_fib = require("../../" + fileName);

describe("#n_fib()", function() {
    it("n = 0 should return 0", function() {
        assert.equal(n_fib(0), 0);
    });

    it("n = 1 should return 1", function() {
        assert.equal(n_fib(1), 1);
    });
});
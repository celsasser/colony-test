/**
 * Date: 2019-07-28
 * Time: 14:06
 * @license MIT (see project's LICENSE file)
 */

const assert = require("assert");
const index = require("../../dist/index");

describe("index", function() {
	describe("assert", function() {
		it("should properly be exported", function() {
			assert.strictEqual(typeof index.assert.deepEqual, "function");
		});
	});

	describe("proxy", function() {
		it("should properly be exported", function() {
			assert.strictEqual(typeof index.proxy.stub, "function");
		});
	});
});

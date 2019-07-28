/**
 * Date: 2019-07-11
 * Time: 22:01
 * @license MIT (see project's LICENSE file)
 */

const assertNode=require("assert");
const assertColony=require("../../dist/assert");

describe("assert", function() {
	describe("deepEqual", function() {
		it("should not throw an exception if objects are equal", function() {
			const object1={a: 1},
				object2={a: 1};
			assertNode.doesNotThrow(
				assertColony.deepEqual.bind(null, object1, object2)
			);
		});

		it("should throw an exception if objects are not equal", function() {
			const object1={a: 1},
				object2={a: 2};
			assertNode.throws(
				assertColony.deepEqual.bind(null, object1, object2)
			);
		});

		it("should throw an exception if objects could be the same if scrubbed but are not", function() {
			const object1={},
				object2={a: undefined};
			assertNode.throws(
				assertColony.deepEqual.bind(null, object1, object2, {
					scrub: false
				})
			);
		});

		it("should not throw an exception if objects could be the same if scrubbed", function() {
			const object1={},
				object2={a: undefined};
			assertNode.doesNotThrow(
				assertColony.deepEqual.bind(null, object1, object2, {
					scrub: true
				})
			);
		});
	});

	describe("false", function() {
		it("should not throw exception if false is false", function() {
			assertNode.doesNotThrow(
				assertColony.falsey.bind(null, false)
			);
		});

		it("should throw exception if false is true", function() {
			assertNode.throws(
				assertColony.falsey.bind(null, true)
			);
		});
	});

	describe("immutable", function() {
		it("should not throw exception if object has not changed", function() {
			const object={},
				assert=assertColony.immutable(object);
			assertNode.doesNotThrow(assert);
		});

		it("should throw exception if object has changed", function() {
			const object={},
				assert=assertColony.immutable(object);
			object.a="edit";
			assertNode.throws(assert);
		});
	});

	describe("isError", function() {
		it("should not throw exception if param is an error", function() {
			assertNode.doesNotThrow(
				assertColony.isError.bind(null, new Error())
			);
		});

		it("should throw exception if param is not an error", function() {
			assertNode.throws(
				assertColony.isError.bind(null, "error")
			);
		});
	});

	describe("matches", function() {
		it("should not throw exception if text matches pattern", function() {
			assertNode.doesNotThrow(
				assertColony.matches.bind(null, "abc", /^abc$/)
			);
		});

		it("should throw exception if text does not match pattern", function() {
			assertNode.throws(
				assertColony.matches.bind(null, "xxx", /^abc$/)
			);
		});
	});

	describe("startsWith", function() {
		it("should not throw exception if text is valid", function() {
			assertNode.doesNotThrow(
				assertColony.startsWith.bind(null, "abc", "a")
			);
		});

		it("should throw exception if text is invalid", function() {
			assertNode.throws(
				assertColony.startsWith.bind(null, "abc", "b")
			);
		});
	});

	describe("true", function() {
		it("should not throw exception if true is true", function() {
			assertNode.doesNotThrow(
				assertColony.truthy.bind(null, true)
			);
		});

		it("should throw exception if true is false", function() {
			assertNode.throws(
				assertColony.truthy.bind(null, false)
			);
		});
	});
});

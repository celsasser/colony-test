/**
 * Date: 2019-07-11
 * Time: 22:01
 * @license MIT (see project's LICENSE file)
 */

const assert=require("assert");
const proxy=require("../../lib/proxy");

describe("test-proxy", function() {
	describe("spy", function() {
		it("should properly spy on a method", function() {
			const object={
				method: ()=>{
					throw new Error();
				}
			};
			proxy.spy(object, "method", ()=>{});
			assert.throws(object.method);
			assert.strictEqual(object.method.callCount, 1);
		});
	});

	describe("stub", function() {
		it("should properly stub a method", function() {
			const object={
				method: ()=>{
					throw new Error();
				}
			};
			proxy.stub(object, "method", ()=>{});
			assert.doesNotThrow(object.method);
			assert.strictEqual(object.method.callCount, 1);
		});
	});

	describe("unstub", function() {
		it("should unstub all stubs that it is tracking", function() {
			const object={
				method: ()=>{
					throw new Error();
				}
			};
			proxy.stub(object, "method", ()=>{});
			assert.doesNotThrow(object.method);
			proxy.unstub();
			assert.throws(object.method);
		});
	});

	describe("setProperty", function() {
		it("should set a property on an object", function() {
			const object={
				key: "value"
			};
			proxy.setProperty(object, "key", "other");
			assert.strictEqual(object.key, "other");
		});
	});

	describe("restoreProperty", function() {
		it("should restore a property with a single reference count", function() {
			const object={
				key: "value"
			};
			proxy.setProperty(object, "key", "other");
			assert.strictEqual(object.key, "other");
			proxy.restoreProperty(object, "key");
			assert.strictEqual(object.key, "value");
		});

		it("should not restore until reference count is 0", function() {
			const object={
				key: "value"
			};
			proxy.setProperty(object, "key", "other");
			proxy.setProperty(object, "key", "mother");
			proxy.restoreProperty(object, "key");
			assert.strictEqual(object.key, "mother");
			proxy.restoreProperty(object, "key");
			assert.strictEqual(object.key, "value");
		});
	});
});

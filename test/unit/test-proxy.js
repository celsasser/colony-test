/**
 * Date: 2019-07-11
 * Time: 22:01
 * @license MIT (see project's LICENSE file)
 */

const assert=require("assert");
const proxy=require("../../dist/proxy");

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
			const stub=proxy.stub(object, "method", ()=>{});
			assert.strictEqual(stub.constructor.name, "Function");
			assert.doesNotThrow(object.method);
			assert.strictEqual(object.method.callCount, 1);
		});
	});

	describe("stubDate", function() {
		it("should properly stub the Date constructor", function() {
			const date=new Date("2000-01-01T12:00:00.000Z"),
				stub=proxy.stubDate(new Date("2000-01-01T12:00:00.000Z"));
			assert.strictEqual(stub.constructor.name, "Object");
			assert.deepEqual(new Date(), date);
			proxy.unstub();
			assert.notDeepEqual(new Date(), date);
		});

		it("should convert a string param to a date", function() {
			proxy.stubDate("2000-01-01T12:00:00.000Z");
			assert.deepEqual(new Date(), new Date("2000-01-01T12:00:00.000Z"));
			proxy.unstub();
		});

		it("should used default date if no param specified", function() {
			proxy.stubDate();
			assert.deepEqual(new Date(), new Date("2000-01-01T00:00:00.000Z"));
			proxy.unstub();
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

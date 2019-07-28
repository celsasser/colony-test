/**
 * Date: 3/5/2019
 * Time: 9:10 PM
 * @license MIT (see project's LICENSE file)
 */

import * as _ from "lodash";
import * as assert from "assert";

const mutation = require("colony-core").mutation.immutable;
const type = require("colony-core").type;


// mixin the guys that we like
export const doesNotThrow = assert.doesNotThrow;
export const ifError = assert.ifError;
export const notDeepEqual = assert.notDeepEqual;
export const notStrictEqual = assert.notStrictEqual;
export const ok = assert.ok;
export const strictEqual = assert.strictEqual;
export const throws = assert.throws;


/**
 * We print out the expected as, in here at least, we frequently want to steal it.
 * @throws {Error}
 */
export function deepEqual(actual: any, expected: any, {
	message = undefined,
	scrub = true
}: {
	message?: string,
	scrub?: boolean
} = {}): void {
	try {
		if(scrub && _.isPlainObject(actual)) {
			actual = mutation.object.scrub(actual);
			expected = mutation.object.scrub(expected);
		}
		assert.deepStrictEqual(actual, expected, message);
	} catch(error) {
		if(_.isPlainObject(actual)) {
			actual = mutation.object.sort(actual);
			expected = mutation.object.sort(expected);
		}
		const actualJSON = JSON.stringify(actual, null, "\t"),
			expectedJSON = JSON.stringify(expected, null, "\t");
		throw new Error(`assert.deepEqual() failed: actual=\n${actualJSON}\nexpected=\n${expectedJSON}`);
	}
}

/**
 * macro for assert.ok(false, error)
 * @throws {Error}
 */
export function fail(error: Error): void {
	// note: we convert it to a string (if an error) so that the assert library doesn't just throw him
	exports.ok(false, error.toString());
}

/**
 * @throws {Error}
 */
export function falsey(condition: any, message?: string): void {
	return assert.ok(Boolean(condition) === false, message);
}

/**
 * Will assert (to log) that all objects passed as params remain unchanged.
 * @throws {Error}
 */
export function immutable(...objects: object[]): () => void {
	const clones = _.map(objects, (object) => [_.cloneDeep(object), object]);
	return function() {
		clones.forEach(function(pair) {
			if(!_.isEqual(pair[0], pair[1])) {
				const expected = JSON.stringify(pair[0], null, "\t"),
					actual = JSON.stringify(pair[1], null, "\t");
				throw new Error(`assert.immutable() failed:\nexpected=${expected}\nactual=${actual}`);
			}
		});
	};
}

/**
 * Asserts <param>value</param> is an error
 * @throws {Error}
 */
export function isError(value: any): void {
	assert.strictEqual(type.name(value), "Error");
}

/**
 * Supports regex comparison
 * @throws {Error}
 */
export function matches(actual: string, pattern: string|RegExp): void {
	if(_.isRegExp(pattern)) {
		if(pattern.test(actual) === false) {
			throw new Error(`assert.matches() failed: "${actual}" does not match ${pattern.toString()}`);
		}
	} else {
		assert.strictEqual(actual, pattern);
	}
}

/**
 * Simply asserts false if called
 * @throws {Error}
 */
export function notCalled(message?: string): void {
	throw new Error(`assert.notCalled() was called${(message !== undefined)
		? `. ${message}`
		: ""}`);
}

/**
 * Asserts that <param>full</param> starts with <param>start</param>
 * @throws {Error}
 */
export function startsWith(full: string, start: string): void {
	if(_.startsWith(full, start) === false) {
		assert.ok(false, `assert.startsWith() failed: "${full}" does not start with "${start}"`);
	}
}

/**
 * @throws {Error}
 */
export function truthy(condition: any, message?: string): void {
	assert.ok(Boolean(condition), message);
}

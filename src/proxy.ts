/**
 * Date: 05/27/18
 * Time: 5:45 PM
 * @license MIT (see project's LICENSE file)
 */

import * as _ from "lodash";
import * as sinon from "sinon";
import * as assert from "./asserts";

interface ObjectProperty {
	name: string,
	object: {[index: string]: any},
	values: any[]
}

interface StubInstance {
	restore(): void;
}


let _stubs: StubInstance[] = [];
const _props: ObjectProperty[] = [];

/**
 * Spies on the specified method and at the same time adds him to our collection of stubs
 * accumulated since the last call to unstub()
 */
export function spy(object: {[index: string]: any}, method: string): sinon.SinonSpy {
	// unstub him if he's already being spied on.
	unstub([object[method]]);
	const spy = sinon.spy(object, method);
	_stubs.push(spy);
	return spy;
}

/**
 * Stubs this method and at the same time adds him to our collection of stubs
 * accumulated since the last call to unstub()
 */
export function stub(object: {[index: string]: any}, method: string, handler: (...args: any[]) => any): sinon.SinonSpy {
	// we are not fancy. If he's already stubbed then get rid of it.
	unstub([object[method]]);
	const stub = sinon.stub(object, method).callsFake(handler);
	_stubs.push(stub);
	return stub;
}

/**
 * Does everything <code>stub</code> does but wraps the handler in a try catch so that exceptions
 * work their way back to the callback method that should be the last param in <param>handler<param>
 */
export function stubCallback(object: {[index: string]: any}, method: string, handler: (...args: any[]) => any): sinon.SinonSpy {
	return stub(object, method, (...args: any[]) => {
		try {
			handler(...args);
		} catch(error) {
			_.last(args)(error);
		}
	});
}

/**
 * Stubs the Date constructor.
 */
export function stubDate(value: Date|string = new Date("2000-01-01T00:00:00.000Z")): sinon.SinonFakeTimers {
	if(_.isString(value)) {
		value = new Date(value);
	}
	const stub = sinon.useFakeTimers(value);
	_stubs.push(stub);
	return stub;
}

/**
 * Unstub methods in functions if they are stubbed.  Defaults to unstub all
 * methods currently being tracked by methods stubbed with stub
 */
export function unstub(functions?: StubInstance[]) {
	if(functions == null) {
		functions = _stubs;
		_stubs = [];
	}
	functions.forEach(function(fnction) {
		if(fnction.restore) {
			fnction.restore();
		}
	});
}

/**
 * Sets value for object[name] and retains the previous value
 */
export function setProperty(object: {[index: string]: any}, name: string, value: any) {
	let instance: ObjectProperty|undefined = _.find(_props, (instance: ObjectProperty) => {
		return instance.object === object && instance.name === name;
	});
	if(instance === undefined) {
		instance = {
			name,
			object,
			values: []
		};
		_props.push(instance);
	}
	instance.values.push(object[name]);
	object[name] = value;
}

/**
 * Restores the previous version
 */
export function restoreProperty(object: {[index: string]: any}, name: string) {
	const index = _.findIndex(_props, (instance: ObjectProperty) => {
		return instance.object === object && instance.name === name;
	});
	assert.notStrictEqual(index, -1);
	const instance = _props[index];
	assert.notStrictEqual(instance.values.length, 0);
	const value = instance.values.pop();
	if(value === undefined) {
		delete object[instance.name];
	} else {
		object[instance.name] = value;
	}
	if(instance.values.length === 0) {
		_props.splice(index, 1);
	}
}

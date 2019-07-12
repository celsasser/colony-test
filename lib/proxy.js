/**
 * Date: 05/27/18
 * Time: 5:45 PM
 * @license MIT (see project's LICENSE file)
 */

const _=require("lodash");
const sinon=require("sinon");
const assert=require("./assert");


let _stubs=[];
const _props=[];

/**
 * Spies on the specified method and at the same time adds him to our collection of stubs
 * accumulated since the last call to unstub()
 * @param {Object} object
 * @param {string} method
 * @returns {wrapMethod}
 */
function spy(object, method) {
	// unstub him if he's already being spied on.
	unstub([object[method]]);
	const spy=sinon.spy(object, method);
	_stubs.push(spy);
	return spy;
}

/**
 * Stubs this method and at the same time adds him to our collection of stubs
 * accumulated since the last call to unstub()
 * @param {Object} object
 * @param {string} method
 * @param {Function} handler
 * @returns {wrapMethod}
 */
function stub(object, method, handler) {
	// we are not fancy. If he's already stubbed then get rid of it.
	unstub([object[method]]);
	const stub=sinon.stub(object, method).callsFake(handler);
	_stubs.push(stub);
	return stub;
}

/**
 * Does everything <code>stub</code> does but wraps the handler in a try catch so that exceptions
 * work their way back to the callback method that should be the last param in <param>handler<param>
 * @param {Object} object
 * @param {string} method
 * @param {function(...args, callback)} handler - function who's last param will be a callback method
 * @returns {wrapMethod}
 */
function stubCallback(object, method, handler) {
	return stub(object, method, (...args)=>{
		try {
			handler(...args);
		} catch(error) {
			_.last(args)(error);
		}
	});
}

/**
 * Unstub methods in functions if they are stubbed.  Defaults to unstub all
 * methods currently being tracked by methods stubbed with stub
 * @param {Array} functions if undefined then unstubs all stubs added via stub
 */
function unstub(functions=undefined) {
	if(functions==null) {
		functions=_stubs;
		_stubs=[];
	}
	functions.forEach(function(fnction) {
		if(fnction.restore) {
			fnction.restore();
		}
	});
}

/**
 * Sets value for object[name] and retains the original value
 * @param {Object} object object with property you want to set
 * @param {string} name
 * @param {*} value
 */
function setProperty(object, name, value) {
	let instance=_.find(_props, (instance)=>{
		return instance.object===object && instance.name===name;
	});
	if(instance===undefined) {
		instance={
			count: 0,
			name,
			object,
			value: object[name]
		};
		_props.push(instance);
	}
	instance.count++;
	object[name]=value;
}

/**
 * Restores original value if ref count is 0
 * @param {Object} object
 * @param {string} name
 */
function restoreProperty(object, name) {
	const index=_.findIndex(_props, (instance)=>{
		return instance.object===object && instance.name===name;
	});
	assert.notStrictEqual(index, -1);
	const instance=_props[index];
	assert.true(instance.count>0);
	if(--instance.count===0) {
		if(instance.value===undefined) {
			delete object[instance.name];
		} else {
			object[instance.name]=instance.value;
		}
		_props.splice(index, 1);
	}
}

module.exports={
	restoreProperty,
	setProperty,
	spy,
	stub,
	stubCallback,
	unstub
};

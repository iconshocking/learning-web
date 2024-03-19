/* eslint-disable no-undef */
// 'this' is a reference to a value that is bound according to the context in which it is called.

import { log } from "console";

log("FUNCTION CONTEXT - AS METHOD");
// FUNCTION CONTEXT:
// 1. If a function is called as a method/property of an object, 'this' is a reference to the object.
// (NOTE: 'this' will be a primitive value when a function is called via a primitive value's prototype chain).
function example() {
  log(this.name);
}
({
  name: "obj1",
  example,
  // behavior is the same for methods defined directly on the object
}).example(); // obj1

({
  name: "obj2",
  example,
}).example(); // obj2

// ONLY the calling context matters, not the defining context (even within the prototype chain the
// defining context is irrelevant)
const obj3 = {
  name: "obj3",
  // method defined on obj3
  example() {
    log(this.name);
  },
};

({
  name: "obj4",
  example: obj3.example,
}).example(); // obj4, not obj3

log("\nFUNCTION CONTEXT - NOT AS METHOD");
// 2. If a function is not called as a method/property of an object, 'this' is undefined in strict
//    mode (which you should always use and is the default in ES6 modules).
try {
  example();
} catch (e) {
  log("not called via object:", e.message);
}
// this is true even if the function is defined as a method on an object
try {
  const unbound = obj3.example;
  unbound();
} catch (e) {
  log("pulled out of object calling context:", e.message);
}

log("\nFUNCTION CONTEXT - CALL/APPLY/BIND FUNCTIONS");
// 3. When a function is called via the Function.prototype.call/apply/bind methods, 'this' is passed
//    as the first argument.
function example2(arg1, arg2) {
  log(this.name, arg1, arg2);
}
// call() and apply() are the same except that call() takes variadic arguments, while apply() takes
// an array of all the arguments
example2.call({ name: "obj5" }, "a", "b"); // obj5 a b
example2.apply({ name: "obj6" }, ["a", "b"]); // obj6 a b
// Reflect.apply() is the same essentially as apply(), but first argument is the function to call

// bind() returns a NEW function where 'this' is permanently bound to the first argument and any
// additional arguments passed are also bound (the original function remains unchanged).
const bound = example2.bind({ name: "obj7" }, "a");
bound("b"); // obj7 a b
// calling bind() again will NOT override the previous binding of 'this' or any bound arguments but
// will bind any additional arguments provided
const doubleBound = bound.bind({ name: "obj8" }, "c");
doubleBound("d"); // obj7 a c (d is ignored)

log("\nFUNCTION CONTEXT - ARROW FUNCTIONS");
// 4. Arrow functions are unique and ALWAYS have a CONSTANT 'this' inherited from the surrounding
//    scope at definition
function wrapper() {
  return {
    name: "obj4",
    example: () => {
      log(this.name); // 'this' at definition is the object calling wrapper()
    },
  };
}
const wrapperObj = {
  name: "wrapperObj",
  wrapper,
};
wrapperObj.wrapper().example(); // wrapperObj, not obj4

log("\nFUNCTION CONTEXT - CONSTRUCTORS");
// 5. When a function is called as a constructor with the 'new' keyword, 'this' correspond to the
//    new object being constructed (which cannot be overridden by call/apply/bind).
function Constructor() {
  this.name = "obj8";
}
log(new Constructor().name);

/* NOTE: In callbacks, 'this' is bound according to the context in which the callback is called (for
example, DOM event listeners set on elements have 'this' as the element in the callback code). This
means that many callbacks have no bound 'this', so make sure to do one of the following WHENEVER
defining a callback that uses 'this' dependent upon the context in which it was defined:
  1. Use an arrow function (which inherits 'this' from the surrounding scope at definition)
  2. Use Function.prototype.bind() to bind 'this' to the callback
  3. Use a variable to store 'this' and reference the variable in the callback since the variable
     will be captured in the closure */

// 5. 'super' is a special keyword that doesn't re-bind 'this' (see classes.js for more details)

// ClASS CONTEXT: see classes.js for details

// NOTE: object literals do NOT create a new 'this' when they are created.

// GLOBAL CONTEXT
log("\nTHIS IN GLOBAL CONTEXT");
/* The global object varies across environments: 'window' in browser, 'self' in web workers,
'global' in Node, etc. '.

Its properties don't require being accessed as properties and can be referenced as global
definitions. */
log(global.Math === Math); // this would crash if called in browser, but works in Node

// To solve this name variance, 'globalThis' provides a consistent reference to the global object
// across all environments (slightly newer API, ~5 years old).
log(globalThis === global);
// NOTE: 'gloablThis' is NOT equivalent to 'this' in global scope because 'this' is undefined in
// modules and functions called directly in strict mode.
log("this is", this, "and global this is", globalThis);

// Note: in browsers, 'globalThis' is technically a Proxy object for the global object, due to
// security considerations (iframes, etc.). Not too important, but good to know.

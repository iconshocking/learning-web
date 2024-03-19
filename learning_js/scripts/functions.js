/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */

// functions can be defined 3 ways:
// 1. function declaration (NOTE: function declarations are hoisted, so they can be used before they
//    are defined, though use it with caution to avoid confusion)
function fun() {
  return "fun";
}
// 2. function expression - must be assigned or invoked immediately
const fun2 = function fun2() { // name is optional
  return "fun2";
};
(function () { // no name
  return "fun2";
})();
// this can be written shorter using an exclamation point to make it an expression without parens,
// but parens will often be added by formatters, so you can leave out the exclamation point unless
// you are really trying to signal to others this is an IIF (immediately invoked function)
!(function () {
  return "fun2";
})();
// 3. arrow function
() => "fun3";

// functions support optional parameters, which are undefined if not passed
{
  function test(num) {
    return num;
  }
  console.log(test());
}

// functions support default parameters, which are evaluated at call time, so parameters are created
// each time (unlike python)
function test(num, array = []) {
  array.push(num);
  return array;
}
console.log(test(1), test(2));

// default parameters can reference previous parameters
function test2(num, array = [num]) {
  return array;
}
console.log(test2(3));

// objects can only be spread into object literals, unless they implement the iterable protocol
// (note: JS does not have named arguments, so order of the iteration is all that matters)
{
  function test(a, b) {
    console.log(a, b);
  }
  test(
    ...{
      a: 1,
      b: 2,
      // will fail without this
      [Symbol.iterator]: function* () {
        yield this.a;
        yield this.b;
      },
    }
  );
}

/* Default parameters can precede non-default parameters, but passed arguments are still
left-to-right, and so will be overridden unless passing undefined).

NOTE: AVOID this when possible since it can be error-prone. */
function f(x = 1, y) {
  console.log([x, y]);
}
f(); // [1, undefined]
f(2); // [2, undefined]
f(undefined, 2); // [2, 3]

// Prefer to use destructuring to achieve the same effect when default initial parameters are desired
// (essentially recreating named parameters, like python)
function f2({ x = 1, y }) {
  console.log([x, y]);
}
f2({ y: 2 }); // [1, 2]

// destructured parameters can also have default values, and you can provide an empty default to
// avoid requiring an argument if all destructured parameters have defaults
function f3({ x = 1, y = 2 } = {}) {
  console.log(x, y);
}
f3(); // 1 2
f3({ y: 3 }); // 1 3

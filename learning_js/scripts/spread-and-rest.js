/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { log } from "console";

log("REST PARAMETERS");
// Rest (...) parameters are used to collect all the remaining arguments into an array
function rest(first, next, ...more) {
  console.log(`Arguments: length = ${arguments.length}`);
  /*   NOTE: Don't really need to use arguments anymore, since rest parameters are more flexible.

  'arguments' is an array-like object, so it doesn't have array methods like forEach(). Can convert
  to normal array using Array.from(). */
  for (const each of arguments) {
    console.log(each);
  }
  // rest parameters
  console.log(`Rest arguments: length = ${more.length}`);
  for (const each of more) {
    console.log(each);
  }
}

console.log();
console.log("rest([3,4,5])");
rest([3, 4, 5]);
console.log("rest(1, 2, [3,4,5])");
rest(1, 2, [3, 4, 5]);
console.log("rest(...[3,4,5])");
rest(...[3, 4, 5]);
console.log("rest(1, ...[2,3,4,5])");
rest(1, ...[2, 3, 4, 5]);

log("\nSPREAD OPERATOR");
// iterables can be spread
const parts = ["shoulders", "knees"];
console.log(["head", ...parts, "and", "toes"]);
// spread replaces need for myFunction.apply(null, args) with myFunction(...args)

// conditional spread
const isSummer = Math.random() >= 0.5;
let fruits = ["apple", "banana", ...(isSummer ? ["watermelon"] : [])];
console.log(fruits);

log("\nOBJECT SPREAD OPERATOR");
// NOTE: object spread ONLY spreads ENUMERABLE properties and only the object's own properties, not
// inherited ones)
const obj1 = { foo: "bar", x: 42 };
const obj2 = { bar: "baz", y: 13 };
console.log({ ...obj1, ...obj2 });

const fruitsObj = {
  apple: 10,
  banana: 5,
  ...(isSummer ? { watermelon: 30 } : {}),
  // shorthand: all falsy values have no enumerable properties, so spreading a falsy value returns
  // an empty object
  ...(isSummer && { goji_berries: 30 }),
};
console.log(fruitsObj);

// NOTE: spread operator has special behavior with getters and setters:
//  1. It calls the getters on the object being spread (if present)
//  2. It defines the properties on the spread-receiving object with the values of the getters
//     (i.e., overrides any existing property/getter/setter for that name)
console.log();
const spread1 = {
  set foo(val) {
    throw new Error("This setter will never be called");
  },
  get foo() {
    throw new Error("This getter will never be called");
  },
  ...{
    set foo(val) {
      throw new Error("This setter will never be called");
    },
    get foo() {
      log("getter");
      return 1;
    },
  },
};
// at this point, spread1.foo is just a normal property with value 2
spread1.foo = 2;
log(spread1.foo);

// Use Object.assign() if you need to preserve getters and setters

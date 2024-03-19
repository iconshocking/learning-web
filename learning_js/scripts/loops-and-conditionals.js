/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-constant-condition */

import { log } from "console";

// for..of loops over iterable properties, i.e., the elements of a collection
console.log("for..of array");
for (const value of ["a", "b", "c"]) {
  console.log(value);
}

/* for..in loops over all enumerable PROPERTIES in the ENTIRE prototype chain (note: not
"iterable"); you don't usually want to do this unless you have an object literal with known,
exhaustive enumerable properties.

If SEARCHING for existence of a property in the prototype chain, use 'in' keyword.
*/
console.log("for..in array");
for (const value in ["a", "b", "c"]) {
  // prints indices
  console.log(value);
}
// will throw using for..of since object is not iterable
console.log("for..in object");
for (const value in { a: 1, b: 2, c: 3 }) {
  console.log(value);
}

// forEach() is equally useful, and provides access to indices and the array itself
console.log("forEach array");
["a", "b", "c"].forEach((value, index, array) => console.log(value, index));
// alternatively, you can use the entries() Array method which returns an iterator of property-value pairs
console.log("entries array");
for (const [index, value] of ["a", "b", "c"].entries()) {
  console.log(index, value);
}

/* In order to be iterable:
  1. An object must implement the iterable protocol, which means its [Symbol.iterator] property is a
     function that returns an object implementing the iterator protocol.
  2. The iterator protocol requires:
    - next() function property that returns next value in the iteration
    - optional: throw() function which can be called by a caller to signal that an error has
      occurred
    - optional: return() function which can be called to signify that iteration has ended before
      exhaustion of iterable elements
  3. All of the functions in the iterator protocol return an IteratorResult, which requires:
    - 'value' property that is the last iterated element (this should be updated in next() calls)
    - 'done' property that is false/absent unless the iterator is exhausted or an error has been
      ecountered, in which case it should be true
*/
const iterable = {
  list: [0, 1, 2, 3, 4, 5],
  listIndex: 0,
  // ES6 method syntax with a [] computed method name
  [Symbol.iterator]() {
    this.listIndex = 0;
    return this;
  },
  next() {
    if (this.listIndex >= this.list.length) {
      return this.return(true);
    }
    // done should only be true AFTER the iterator is exhausted since it will immediately end the
    // iteration when returned
    const result = {
      value: this.list[this.listIndex],
      done: false,
    };
    this.listIndex++;
    return result;
  },
  // throw() rarely used for iterators - more common for generators due to resumable control flow
  throw() {
    console.log("iterator throw() called");
    return this.return(); // perform any needed cleanup
  },
  return(manualCall = false) {
    console.log(`iterator return() called ${manualCall ? "by my code" : "by system code"}`);
    return { done: true };
  },
};

log("\nfor..of iterable");
for (const elem of iterable) {
  console.log(elem);
}

// the iterator return() function is called whenever a standard for..of loop is terminated early via
// break, cotinue, or return
log("\nfor..of iterable w/ break");
for (const elem of iterable) {
  console.log(elem);
  if (iterable.listIndex === 2) break;
}
/* NOTE: destructuring also performs iteration under-the-hood, but it only reaches iterator
exhaustion (i.e, not calling return() automatically):
1. if the destructuring is LONGER than the iterable (unless your iterator incorrectly returns done:
   true for the last element)
2. Or if the destructuring uses the rest operator (...)

Due to this, you should ALWAYS call return() manually before returning the final element in the
iteration if the iterable requires teardown */
log("\ndestructuring iterable");
{
  const [iterElem0, iterElem1] = iterable;
  log(iterElem0, iterElem1);
}
{
  const [iterElem0, ...iterElem1] = iterable;
  // no automatic return() call before this log
  log(iterElem0, iterElem1);
}

// break and continue work as expected
console.log("\nfor..of array with break and continue");
outer: while (true) {
  for (const value of ["a", "b", "c", "d"]) {
    if (value === "a") {
      continue;
    }
    console.log(value);
    if (value === "c") {
      break outer;
    }
  }
  console.log("won't print");
}
// break can also break out of a labeled block
console.log("break w/ block label");
label: {
  console.log("log");
  break label;
  // eslint-disable-next-line no-unreachable
  console.log("won't print this log");
}

// switch
let x = 0;
switch (x) {
  case 0:
  case -1: // multiple matches
    break; // needed to prevent fall through
  case 1:
    break;
  default:
    break;
}
/* You can do some weird stuff by putting arbitrary conditionals in the switch when using true as
the switch value because the switch cases check which case expression evaluates to the switch value
(i.e., true). 

DO NOT do this in general though because it's confusing. */
switch (true) {
  case x === 0:
    break;
  case x === 1:
    break;
  default:
    break;
}

// || and && return the value of the last expression evaluated (i.e., when the expression short circuits)
console.log("first" || "second"); // 'first' since it's truthy
console.log("first" && "second"); // 'second' since "first" is truthy and so the second expression can't be short circuited

// nullish coalescing operator and nullish assignment operator only performs operation if the value
// in question is null or undefined
let y;
console.log(y ?? "default");
y = "new value";
y ??= "won't change";
console.log(y);

// optional chaining operator
console.log({ a: 1 }.b?.a); // undefined, instead of throwing

// JS assigments are expressions that return the value of the variable after assignment (like Java,
// unlike Kotlin, unlike Python but you can use the walrus operator for the same effect)
let n = 3;
do {
  console.log(n);
} while ((n -= 1) > 0);

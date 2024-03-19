/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-constant-condition */
import { log } from "console";

/* JS does NOT have:
1. chained assigments w/ declaration (i.e., let a = b = 0) where a and b are being declared OR
2. multiple assignment (a, b = 0, 1) */
{
  // BUT it DOES have expression assigments
  let a;
  if ((a = 0) < 1) {
    // assigns 0 to a and then expression evaluates to value of a
    log("assigned and expression");
  }
  // can simulate chained assignment w/o declaration this way
  let c;
  let b = (c = 10); // works because c is already declared
  // b = c = 10 after both have been declared also works
  log(a, b);
}
{
  // it ALSO DOES have destructuring assignment if you need to set multple different values
  let [a, b] = [1, 2];
  log(a, b); // 1 2
}

{
  // equality comes in two forms: normal (==) and strict (===);
  // Almost ALWAYS use === to avoid bugs
  log(1 == "1"); // true
  log(1 === "1"); // false
  // == attempts type conversion; === does not and performs reference equality checks for objects
  let a = {};
  let b = a;
  log("reference equality", a === b); // true
  // log(a === {}) would be false

  // undefined and null have reference equality with any expression/variable that is undefined or null
  a = null;
  log(a === null); // true
  // CAUTION: undefined and null are not === equal, so usually use truthiness or nullish coalescing
  // operator if checking for either (common use case)
  log(undefined === null); // false

  // there is no operator overloading in JS, so there is no way to define custom equality checks
}

{
  // all JS values evaluate to true or false in a boolean context; theses are the falsy values:
  log("falsies", 0 || -0 || NaN || "" || null || undefined || false);
  // since 0 is falsy, be careful when checking against variables that can be numbers

  // any object is truthy
  log(!!{}); // !! is quick syntax to convert to boolean (not not) instead of Boolean()
  log(!![]);
  // includes wrappers of primitives (note: 'new' constructs an object; without it, the function
  // computes the primitive conversion of the object)
  log("object wrappers", !!(new String(5) && new Number(0) && new Boolean(false)));
}

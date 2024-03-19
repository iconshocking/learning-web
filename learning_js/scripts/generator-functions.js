/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { log } from "console";

/* Generator functions return a generator object, which conforms to the iterable and iterator
  protocol:
  - next() returns { value: XXX, done: false }, where XXX is the value of the expression following
    the halting yield
  - return() returns { done: true } immediately as if the return() call was inserted into the
    generator
  - throw(eror) throws the error at the location of the last yield expression (this allows for error
    handling in the generator via try-catch)
 */

// generator functions are denoted by a * before the function name (or before the parameters for an
// anonymous function)
function* infiniteCounter() {
  try {
    let index = 0;
    while (true) {
      // the expression after the yield is evaluated and set as value of the iterator, and the generator is paused
      yield index++;
    }
  } catch (e) {
    // throw() function is more useful to generators than to other iterators, due to try-catch control flow
    log("infiniteCounter throw caught:", e.message);
  } finally {
    // return() function sort of cleanup should be in the finally block since it will always run,
    // regardless of normal iterator exhaustion, error, or return
    log("infiniteCounter cleanup");
  }
}
let gen = infiniteCounter();
log(!!(gen.next && gen.return && gen.throw && gen[Symbol.iterator]));
log(gen[Symbol.iterator]() === gen);

let i = 0;
for (const value of gen) {
  console.log(value);
  ++i;
  if (i >= 5) {
    gen.throw(new Error("too many iterations"));
    break;
  }
}
console.log();

// can be set as a property, method, or as the iterator of a class/object
const someObj1 = {
  *generator() {
    yield "a";
    yield "b";
  },
};
class Foo1 {
  *generator() {
    yield 1;
    yield 2;
  }
}
const someObj2 = {
  *[Symbol.iterator]() {
    yield "a";
    yield "b";
  },
};
class Foo2 {
  *[Symbol.iterator]() {
    yield 1;
    yield 2;
  }
}

// yield*
function* generator(i) {
  yield i;
  // A return value of the nested generator is the value of the yield* expression,
  // but it does not cause a yield in the parent generator,
  // so it must be manually yielded/returned to be output from the next call.
  // Note: the return value of a function/generator with no return statement is undefined.
  yield yield* anotherGenerator(i);
  // can yield* to any iterable
  yield* [-1, -2];
  yield i + 10;
}
function* anotherGenerator(i) {
  yield i + 1;
  yield i + 2;
  return i + 3;
}
gen = generator(10);
let next = gen.next();
while (next.done === false || next.value !== undefined) {
  console.log(next.value);
  next = gen.next();
}
console.log();

// next() w/ argument
function* logGenerator() {
  console.log(0);
  console.log(1, yield);
  console.log(2, yield);
  console.log(3, yield);
}
gen = logGenerator();
// calling .next() with an argument replaces the last yielded expression with the argument
// (argument is explicitly ignored on first .next() call, which further enforces that it will be ignored before an initial yield)
// (personal note: seems like rarely used functionality...)
gen.next();
gen.next("pretzel");
gen.next("california");
gen.next("mayonnaise");

// The next(), throw(), and return() methods of the current generator are all forwarded to any delegated underlying iterator.
const iterable = {
  [Symbol.iterator]() {
    let count = 0;
    return {
      next(v) {
        console.log("next called with", v);
        count++;
        return { value: count, done: false };
      },
      return(v) {
        console.log("return called with", v);
        return { value: "iterable return value", done: false };
      },
    };
  },
};
function* gf() {
  yield* iterable;
}
gen = gf();
// argument ignored since first .next() call
console.log(gen.next(10));
console.log(gen.next(20));
console.log(gen.return(30));
// return didn't set done to true, so generator will allow for continued iterating of the delegated iterator
console.log(gen.next(40));
// delegated iterator doesn't implement .throw(), so a TypeError is thrown
try {
  console.log(gen.throw(new Error("error")));
} catch (e) {
  console.log(e.message);
}

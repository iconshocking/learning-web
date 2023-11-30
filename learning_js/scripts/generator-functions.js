function* idMaker() {
  let index = 0;
  while (true) {
    // the expression after the yield is evaluated and set as value of the iterator, and the generator is paused
    yield index++;
  }
}
let gen = idMaker();
for (let i = 0; i < 5; i++) {
  console.log(gen.next().value);
}
console.log();

// can be set as a property, method, or as the iterator of a class/object
const someObj1 = {
  *generator() {
    yield "a";
    yield "b";
  },
};
const someObj2 = {
  *[Symbol.iterator]() {
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
console.log(gen.throw(new Error("error")));

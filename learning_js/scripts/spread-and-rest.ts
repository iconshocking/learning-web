function rest(first?: any, next?: any, ...more: any[]) {
  console.log(`Arguments: length = ${arguments.length}`);
  //   arguments is an array-like object, so it doesn't have array methods like forEach().
  //   Can convert to normal array using Array.from().
  for (const each of arguments) {
    console.log(each);
  }
  console.log(`Rest arguments: length = ${more.length}`);
  for (const each of more) {
    console.log(each);
  }
  console.log();
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

const parts = ["shoulders", "knees"];
console.log(["head", ...parts, "and", "toes"]);

// Spread replaces need for myFunction.apply(null, args) with myFunction(...args)

const isSummer = Math.random() >= 0.5;
let fruits = ["apple", "banana", ...(isSummer ? ["watermelon"] : [])];
console.log(fruits);

const obj1 = { foo: "bar", x: 42 };
const obj2 = { bar: "baz", y: 13 };
console.log({ ...obj1, ...obj2 });

const fruitsObj = {
  apple: 10,
  banana: 5,
  ...(isSummer ? { watermelon: 30 } : {}),
  // all falsy values have no enumerable properties, so spreading a falsy value returns an empty object
  ...(isSummer && { goji_berries: 30 }),
};
console.log(fruitsObj);

console.log();
const objectAssign = Object.assign(
  {
    set foo(val: any) {
      console.log(val);
    },
  },
  { foo: 1 }
);
// Logs "1"

const spread = {
  set foo(val: any) {
    console.log(val);
  },
  ...{ foo: 2 },
};
spread.foo = 3;
// 2 will not be logged, but 3 will be
// (however, nodeJs will log 2 and 3; therefore, this is inconsistent, so don't rely on this behavior)
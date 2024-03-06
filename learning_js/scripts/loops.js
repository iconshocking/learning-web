/* eslint-disable no-constant-condition */
// for..of loops over iterable properties, i.e., the elements of a collection
console.log("for..of array");
for (const value of ["a", "b", "c"]) {
  console.log(value);
}
console.log("for..in array");
// for..in loops over all enumerable PROPERTIES
for (const value in ["a", "b", "c"]) {
  // prints indices
  console.log(value);
}
// will throw using for..of since object is not iterable
console.log("for..in object");
for (const value in { a: 1, b: 2, c: 3 }) {
  console.log(value);
}

// break and continue work as expected
console.log("for..of array with break and continue");
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

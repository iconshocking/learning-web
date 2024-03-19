//  JS uses mark-and-sweep garbage collection, so circular references are not a problem

// the 'delete' operator allows for removing a property from an object, but it does not free up the
// memory, so it should only be used when a property should be removed from an object (for passing
// over the wire, etc.)
{
  let obj = { a: 1, b: 2 };
  delete obj.a;
  console.log(obj);
  // 'delete' can be used in some other ways in non-strict mode (sloppy mode), but strict mode is on
  // by default in ES6 modules, and should always be enabled (has existed since ES5)
}

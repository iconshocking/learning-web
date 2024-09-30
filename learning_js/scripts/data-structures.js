/* eslint-disable @typescript-eslint/no-unused-vars */
import { log } from "console";

/* Since JS implementation is dependent on the engine and can be implemented much more efficiently
than expected by the surfaced JS language (since engines are written in C, etc.), most data
structure performance optimizations are not important UNTIL profiling shows they are. */

// array-likes have the 'length' property and are indexable (but not necessarily iterable, though
// this is rare), but they do not have array methods and must be converted to use them
log("ARRAY-LIKES");
{
  let array = [..."string"];
  console.log(array.filter((x) => x >= "s"));
  array = Array.from("string");
  console.log(array.filter((x) => x < "s"));
  // can also use Array.prototype methods directly
  console.log(Array.prototype.includes.call("string", "g"));
}

log("EMPTY SLOTS");
/* ALWAYS BEWARE OF EMPTY SLOTS IN ARRAYS IN ARRAY CREATION.

  Different functions behave differently in accordance with them */
{
  // empty slots
  let array = Array(5);
  log(array);
  // DON'T DO THIS - [ , , ] (i.e., explicit empty slots) is a thing but eslint will throw an error
  array = [0, 1];
  // TRY NOT TO DO THIS - empty items created for any lower unassigned indices
  array[5] = 5;
  log(array);
  // (DO NOT DO THIS - USE splice() INSTEAD)
  // delete removes a property (does nothing else related to memory), and doesn't need to be used very often
  delete array[1]; // creates an empty slot
  log(array);
  // creates empty slots
  array.length = 200;
  log(array);

  // UNLESS YOU NEED EMPTY SLOTS, use one of the following methods to create arrays that aren't array literals:
  // 1: fill() - fills empty slots with a value
  array = Array(5).fill(undefined);
  log(array);
  // 2: Array.from() -  similar to list comprehensions in python;
  // (note: x is undefined since the first argument is an array-like without any index properties)
  array = Array.from({ length: 5 }, (x, idx) => undefined); // map function is optional - filled with undefined by default
  console.log(array);
  // you can also use map(), but make sure you know whether what you are mapping from has empty slots
  // 3. spread turns empty slots into undefined (though this often isn't too useful)
  array = [...Array(5)];
  console.log(array);
}

log("\nARRAY OPERATIONS");
// standard array operations
{
  const arr = [0, 1, 2, 3, 4];
  console.log(arr.includes(3));
  console.log(arr.indexOf(3, 3)); // optional start index
  console.log(arr.some((x) => x > 3));
  console.log(arr.filter((x) => x > 3));
  arr.push(5); // to end
  console.log(arr);
  arr.pop(); // from end
  console.log(arr);
  arr.shift(); // from front
  console.log(arr);
  arr.unshift(0); // to front
  console.log(arr);
  // splice used for indexed insertion/deletion
  arr.splice(2, 2, "two", "three"); // remove 2 elements at index 2 and insert replacements
  console.log(arr);
  console.log(arr.slice(0, 3)); // subarray - end exclusive
  // initial value is optional but I find not including it to make bugs more likely
  console.log(
    arr.reduce(
      (prev, next, idx, array) => `${prev}${next}${idx !== array.length - 1 ? ", " : ""}`,
      ""
    )
  );
  console.log([0, 1, 2, 3].sort((a, b) => -(a - b))); // sorts in place
  console.log([0, 1, 2, 3].reverse()); // reverses in place
  arr.length = 0; // clear array (actually does delete elements - not a hack)
  console.log(arr);
  // can also call foreach, map, etc.
}

log("\nOBJECTS");
// there are fewer default operations on general objects since they are not iterable
{
  const symb = Symbol("symbol description");
  const object = {
    a: 1,
    function: () => 2,
    /* ES6 method syntax (same as for classes), which comes with some small differences in behavior
        from normal functions defined as properties:
        1. Not constructable (i.e., cannot be called with 'new') - throws an error
        2. Allows use of super to access the prototype chain (vital for classes, but maybe unusual
           for objects)
     */
    function2() {
      return 3;
    },
    // supports getters and setters
    get accessorOnly() {
      return "accessor only";
    },
    set accessorOnly(value) {
      console.log("value not set");
    },
    [symb]: "symbol value",
    ["computed" + "property name"]: "computed property value",
  };

  console.log(object.accessorOnly);
  object.accessorOnly = 1;

  // USE the 'in' keyword for checking property existence in the prototype chain, since it can check
  // symbols (for..in does not return symbols)
  console.log(symb in object);
  // 'in' also supports checking for private properties without crashing if called

  // ONLY OWN enumerable properties (NOT inherited from prototype chain)
  log(Object.keys(object)); // can also use Object.keys()/values(), but none return symbol properties
  // object spread (...) is the only other option that only returns enumerable properties only

  // ALL OWN properties (NOT inherited from prototype chain)
  log(Reflect.ownKeys(object)); // can also use Object.getOwnPropertyDescriptors/Names/Symbols, the last two being subsets
  log(Object.hasOwn("accessorOnly"));
  // NOTE: hasOwn() is newer (equivalent to hasOwnProperty()); better because it is not in the
  // prototype chain of the instance, making it non-overridable via the instance.

  // clever use of getters and setters is for lazy evaluation
  const lazyObject = {
    get lazy() {
      // remove existing accessors
      delete this.lazy;
      // replace with a normal property
      return (this.lazy = "heavy value to compute");
    },
    // note that not including a setter means the property is read-only and will crash if someone tries to set it
  };
  log(lazyObject.lazy);
  lazyObject.lazy = "new value"; // settable since this is standard property after first get()
  log(lazyObject.lazy);

  log("\nOBJECT.ASSIGN()");
  /*   Object.assign() is the only way to copy properties from one object to another in place (i.e.,
  without creating a new object).
    1. The getters on the source object are called (if present)
    2. The setters on the target object are called with the values from the getters (if present)

  NOTE: Because the properties are ASSIGNED, not DEFINED, it will not overwrite getters/setters
  on the target object (unlike the object spread operator's copy object). */
  {
    const target = {
      get accessorOnly() {
        log("this is the OG getter");
        return "OG value";
      },
      set accessorOnly(value) {
        log("this is the OG setter", "called with value:", value);
      },
    };
    const copy = {
      bonusProp: "bonus prop",
      get accessorOnly() {
        log("this is the copy getter");
        return "copy value";
      },
      set accessorOnly(value) {
        log("this is the copy setter", "called with value:", value);
      },
    };
    Object.assign(target, copy);
    log(target.bonusProp);
    log(target.accessorOnly);
    target.accessorOnly = "new value";
    log(target.accessorOnly);
  }

  log("\nOBJECT.DEFINEPROPERTY()");
  // The only way to set a getter/setter after object creation is to use
  // Object.defineProperty/Properties()
  const newObj = {};
  Object.defineProperty(newObj, "prop", {
    get() {
      log("getter");
      return this._prop;
    },
    set(value) {
      log("setter");
      this._prop = value;
    },
  });
  newObj.prop = 1;
  log(newObj.prop);
}

log("\nSTRING OPERATIONS");
{
  let string = "strings strings strings";
  console.log(string.includes("s"));
  console.log(string.startsWith("s"));
  console.log(string.endsWith("s"));
  console.log(string.split("s", 2)); // limit
  console.log(string.split(/(?:s)/)); // capture groups are included in the result, so use non-capturing usually
  console.log(string.includes("string")); // for regexp, use search() (or match() but search() is apparently faster)
  console.log(string.indexOf("string", 1)); // optional start index
  console.log(string.matchAll(/s(?<namedgroup>tring)/g).next()); // includes capture groups, index, and named capture groups
  console.log(string.replace(/string/g, "strung")); // must use global regexp to replace all occurrences
  console.log([...string].reverse().join("")); // reverse string (also join())
}

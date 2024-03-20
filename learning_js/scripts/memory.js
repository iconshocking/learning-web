import { log } from "console";

// JS uses mark-and-sweep garbage collection:
//  - circular references are not a problem once object is unreachable via root traversal
//  - weak references are not traversed, so any references (or circular references) only reachable
//    through them will not prevent garbage collection

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

/* WARNING: ONLY USE WEAK REFERENCES IF YOU KNOW WHAT YOU ARE DOING AND NEED TO */

// WeakRef lets you create a weak reference to an object
{
  const obj = {};
  obj.key = {};
  const weakRef = new WeakRef(obj);
  // returns the object or undefined if it has been garbage collected
  const loop = () => {
    if (weakRef.deref()) {
      log("ref still here");
      setTimeout(loop, 1000);
    }
  };
  loop();
}
// obj is out of scope starting here, so it is eligible for garbage collection
//  - Technically, in Node, it is eligible for garbage collection as soon as the file is done
//    executing even without the containing block because any reference not captured in a closure
//    will be lost. BUT in a browser, removing the containing block would make the loop run
//    forever.)

// WeakMap and WeakSet are also available, where the keys are weak references. If the key is garbage
// collected, then the value is eligible for garbage collection if not referenced elsewhere.
{
  const weakMap = new WeakMap();
  let key = {};
  weakMap.set(key, "value");
  key = null; // garbage collection is now possible

  // NOTE: a circular reference to the key within the value of a WeakMap/WeakSet does not prevent
  // garbage collection

  // NOTE: WeakMap and WeakSet are not iterable because of their key instability

  // interesting note: there is no possibility of accessing garbage collected keys/values in a WeakMap because
  // you would need a reference to the key to query its value, which would prevent garbage
  // collection
}

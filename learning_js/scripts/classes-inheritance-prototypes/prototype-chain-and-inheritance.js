/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-array-constructor */
/* eslint-disable no-inner-declarations */
import { log } from "console";

/* HELPFUL LOGGING NOTE:

When logging, the name of object is its:
1. [[Prototype]].constructor.name
2. UNLESS [[Prototype]] is Object.prototype, then no name is logged
3. UNLESS [[Prototype]] is null, in which case the name is logged as '[Object: null prototype]'
*/

/*
JS properties are searched for via the prototype chain:
1. The object itself
2. Its prototype
3. Successive prototypes up the chain until reaching null, the terminal prototype


There are 2 entities that while very similar need to be distinguished:
1. 'prototype' property on constructor functions
    - ONLY exists on constructor functions (technically all functions except arrow functions)
    - Automatically created for all constructor functions upon definition and only contains a
      self-referential 'constructor' attribute.
2. [[Prototype]]/Object.getPrototypeOf()/__proto__ (deprecated)
    - Refers to the object which is traversed in the prototype chain, and defines the properties
      accessible from an object instance.
    - Is set as the 'prototype' property of its constructor function upon construction of the
      instance.
      - i.e., `Object.getPrototypeOf(new Thing()) === Thing.prototype`

NEITHER of these objects are instances of objects created from constructor functions. They simply
hold:
1. the 'constructor' property
2. any properties/methods set manually via code (or by defining methods when using classes)
*/

log("SETTING PROTOTYPES");
/* To set the prototype of an object in simple cases, use Object.create():

DO NOT set the [[Prototype]] via:
1. '__proto__' property when creating an object literal (it is standardized, but too confused with
   the property access syntax, which is non-standard and deprecated)
2. Object.setPrototypeOf() IF instances have already been created because it is VERY nonperformant
   (kills under-the-hood optimizations related to the object in the JS runtime engine)

Object.create() is only used when not using classes, which perform most [[Prototype]] assignment
automatically, nor constructor functions, which can utilize Object.setPrototypeOf().*/
{
  const obj = Object.create({ foo: "bar" });
  obj.foo; // "bar"
  log(obj); // {}
  log(Object.getPrototypeOf(obj)); // { foo: 'bar' }
}

log("\nVALUE OF THIS WITH PROTOTYPES");
/* Since 'this' is set according to the caller of a property/function, 'this' will always refer to
the child instance's properties even when executing code from an ancestor in the prototype chain. */
{
  const parent = {
    value: 2,
    method() {
      return this.value + 1;
    },
  };
  const child = Object.create(parent);
  child.value = 3; // shadows the parent prototype's 'value' property
  // 'this' in method() will refer to the child class because it is the caller
  log(child.method()); // 4
  log(Object.getPrototypeOf(child).method()); // 3 (parent's 'value' still exists)
}

log("\nCONSTRUCTOR FUNCTIONS");
/* Constructor functions are how we can set a prototype for object instances automatically.

Every constructor function's 'prototype' property by default is a plain Object with only a
'constructor' property that points to the constructor function itself, i.e., a self-referential
property.

NOTE: While in many cases it won't cause issues, when implementing inheritance NOT using classes,
you should make sure to maintain the 'Constructor.prototype.constructor === Constructor' identity to
avoid possible bugs. 

When called with 'new', the constructor function:
  1. creates a new plain JS object, which will be used as 'this' in the constructor function
  2. sets the [[Prototype]] of the new object to the constructor's 'prototype' property
  3. runs the constructor function with the instance-bound 'this'
  4. returns the instance (UNLESS the constructor explicit returns, which replaces the instance -
     NOT recommended since it is confusing/unusual)
*/
{
  // NOTE: Constructor functions should almost NEVER return, because the return value will replace
  // the constructed instance.
  function Box(value) {
    this.value = value;
  }
  const box1 = new Box(1);
  const box2 = new Box(2);
  // since Box.prototype is same exact object as any Box instance's [[Prototype]], changes to the
  // prototype will affect all instances, regardless of when they were created (this allows for
  // extension function behavior like in Kotlin)
  Box.prototype.printValue = function () {
    log(this.value);
  };
  box1.printValue(); // 1
  box2.printValue(); // 2

  // this self-referential 'constructor' property allows retrieving the constructor from an instance
  log(Object.getPrototypeOf(box1).constructor === Box); //true
}
{
  // classes are just syntactic sugar over for constructor functions
  class Box {
    constructor(value) {
      this.value = value;
    }
    printValue() {
      log(this.value);
    }
  }
  const box1 = new Box(1);
  box1.printValue(); // 1
  log(Object.getPrototypeOf(box1) === Box.prototype); // true
}
{
  // all construction of literals in JS is done via constructor functions under-the-hood, and these
  // Constructor functions' 'Constructor.prototype' provide the [[Prototype]] for the created
  // objects
  new Object(); // {}
  new Array(); // []
  new RegExp("a"); // /a/
  new Function(); // though DO NOT USE since this is not exactly equivalent to standard function creation

  // DO NOT add properties to the prototype of built-in objects like these since your changes will
  // break if JS ever adds those properties in the future (only acceptable for backporting settled
  // language features)
}

/* Inheritance can be built by setting [[Prototypes]] on Constructor.prototype objects. This creates
a chain of [[Prototype]] objects that traverses multiple Constructor.prototypes, allowing any of
their properties to be called via an instance of the child-most constructor function. */
log("\nINHERITANCE");
{
  function Derived() {
    this.instanceMethod = function () {};
  }
  Derived.prototype.derivedMethod = function () {};
  function Base() {}
  Base.prototype.baseMethod = function () {};
  /* This is safe to call w/o performance issues if the constructor hasn't created any instance yet.
  The line below is equivalent to the following, but more clear and less error-prone:

  Object.create(Base.prototype);
   */
  Object.setPrototypeOf(Derived.prototype, Base.prototype);
  // DO NOT DO THIS: you can instead use Object.create() and then set the 'constructor' property
  // back to the self-reference, but that is more error-prone with no performance benefit

  const obj = new Derived();
  let proto = obj;
  while ((proto = Object.getPrototypeOf(proto))) {
    log(
      proto.constructor.name +
        ".prototype has keys (" +
        Reflect.ownKeys(proto) +
        ") and its [[Prototype]] === " +
        (Object.getPrototypeOf(proto)?.constructor.name.concat(".prototype") ?? "null")
    );
  }

  // The same can be done to extend static properties, i.e., properties defined on the constructors
  // themselves (in classes, you get this for free with the 'static' keyword)
  Derived.prototype.callStatic = function callStatic() {
    this.constructor.static();
  };
  Base.static = function () {
    log("static method called");
  };
  Object.setPrototypeOf(Derived, Base);
  new Derived().callStatic();

  /* To provide subclassing behavior for the contructor function ITSELF, you can use
  Reflect.construct() to call the parent constructor function with the subclass set as 'new.target',
  BUT you should really just use classes, which give you this for free with 'super' calls in the
  constructor.

  NOTE: When constructing instances from classes / constructor functions, 'new.target.prototype' is
  the [[Prototype]] of the instance created from the call. */
  function ThingExtension(entries) {
    return Reflect.construct(Map, [entries], ThingExtension);
    // we cannot use 'new' in this scenario because Map requires the usage of 'new', but calling
    // 'return new Map(entries)' will have the 'new.target' be Map in the Map constructor, so the
    // returned instance will just be a Map instance with no relation to MapExtension.prototype
    // (remember: any returned value replaces the constructed instance)
  }
  ThingExtension.prototype.extension = function extension() {
    log("extension method called");
  };
  Object.setPrototypeOf(ThingExtension, Map);
  Object.setPrototypeOf(ThingExtension.prototype, Map.prototype);
  const map = new ThingExtension([["a", 1]]);
  log(map);
  map.extension();
}
/* NOTE: Performance problems can occur with the following, but it is not a problem except in
  more extreme cases:
  1) long inheritance chains
  2) extremely dynamic property intercepts */

/* Interesting note: you can bind constructor functions with arguments, BUT 'this' and 'new.target'
will operate as usual as if the function had NOT been bound (bound constructors also can't be
subclassed because they lack the 'prototype' property) */

log("\nNULL-PROTOTYPE OBJECTS");
// NOTE: All objects by default (except for some particular exceptions) have Object.prototype in
// their prototype chain: in order not to, null must be set explicitly as their [[Prototype]].
const object = Object.create(Object.prototype);
const nullProtoObject = Object.create(null);
try {
  object.toString();
  nullProtoObject.toString(); // does not have Object.prototype functions accessible
} catch (e) {
  log(e.message);
}

log("\nINSTANCEOF");
// NOTE: 'A instanceof B' operator checks whether B.prototype (so B must be a constructor function)
// is referentially equal to any prototype in A's prototype chain.
{
  function Solid() {}
  function Matter() {}
  log(new Solid() instanceof Matter); // false
  Object.setPrototypeOf(Solid.prototype, Matter.prototype);
  log(new Solid() instanceof Matter); // true
  log(Object.getPrototypeOf(Object.getPrototypeOf(new Solid())) === Matter.prototype);
}

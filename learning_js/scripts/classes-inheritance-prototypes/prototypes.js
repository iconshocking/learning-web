/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-inner-declarations */

import { log } from "console";

console.log("PRIMITIVE TYPE WRAPPERS");
// primitive types that aren't objects wrap themselves in the relvant object when a property is
// accessed so that the prototype can be used
let str = "hi";
// indices are properties of the String object instance itself
console.log(Object.getOwnPropertyNames(str));
// all other properties are on the String prototype
console.log(Object.getOwnPropertyNames(String.prototype));

console.log("\nMETHOD SHADOWING");
// shadowing (overriding in traditional class-based languages)
const myDate = new Date(1995, 11, 17);
console.log(myDate.getYear());
myDate.getYear = () => "Shadowed!";
console.log(myDate.getYear());

console.log("\nCLASSES");
/* Overview of classes:

Classes and subclasses are essentially syntatic sugar for creating objects with a prototype chain,
but there is some class specific functionality.

Note: classes are not hoisted, unlike function declarations, so they must be declared before they
are accessed.

Class definition evaluation order (NOT INSTANCE CREATION - see the subclassing section below):
- (unimportant) 'extends' is evaluted for a valid constructor function or null + constructor is
  replaced by default if not present
1. property keys are computed (if needed) and evaluated, where 'this' refers to the surrounding
   scope's this at the point of class declaration/expression
2. 'constructor' and static/instance methods/accessors are added to the prototype, which is set as a
   proprty on the class constructor function
3. Static fields/blocks are evaluated, with 'this' referring to the class constructor.

NOTE: Evaluation is always performed in declared order (for class creation and class INSTANCE
creation), so do not reference a later static/instance field/block in an earlier one (methods are
fine UNLESS they are invoked within the class/instance creation.)
*/
{
  const outsideValue = "outside value";
  class Example {

    // class fields are set on the INSTANCE, not the prototype (similar syntax to Java/Kotlin)
    name; // undefined if no value set
    constant = "constant";
    // outside scope 'this'
    ["computed" + "PropertyName" + console.log("compouted with this =", this)] = "constant 2";


    /* NOTE: 'static' is a newer feature and should ONLY be used if the desired browsers all support
    it.

    'static' keyword assigns properties and methods to the constructor itself, NOT the prototype.
    This means two things: 
    1. they are not in the prototype chain, thus cannot be called via instances (exactly like
       Java/Kotlin 'static')
    2. 'this' in static scopes refer to the constructor function itself */
    static staticProperty = "static value of " + this.name;
    static staticMethod() {
      return "static method of " + this.name;
    }
    static {
      console.log("static initialization block of " + this.name);
    }


    // NOTE: accessors/methods are added to the prototype of the constructor function, NOT the instance
    // itself, so they are not spreadable
    get accessor() {
      return "accessor value";
    }
    set accessor(value) {
      console.log("value not set");
    }
    greet() {
      console.log("hi", this.name);
    }


    /* NOTE: private fields/methods are a newer feature and should ONLY be used if the desired browsers
    all support them.

    Classes support private fields/methods - these are not accessible outside the class or in
    subclasses (like Java/Kotlin) and are NOT accessible on the prototype. */
    #privateField = "private field";
    #privateMethod() {
      console.log("private method");
    }
    // trying to access a private property outside the class will throw an Error
    thisIsLegal(obj) {
      // note the special syntax with 'in' here, where we are using the private field itself instead
      // of a property name/symbol
      console.log("private field " + (#privateField in obj ? "found" : "not found")); // no error
      this.#privateMethod();
    }

    // private static fields should always use the class name to avoid errors
    static #privateStaticField = "private static field";
    static publicStaticMethod() {
      log(Example.#privateStaticField);
      // the following line would crash if called from a subclass's static method because 'this'
      // would be the subclass constructor, not Example

      // log(this.#privateStaticField);
    }


    // parent initialization of 'this' is done by now, so 'this' can be used
    // parentConstructor = super().constructor;

    /* - class constructor is only invoked when using the 'new' keyword
       - constructor is optional; if not provided, a default constructor is created:
          1. if a non-derived class, an empty constructor
          2. if a derived class, a constructor that calls the parent constructor with all arguments
             (i.e., constructor(...args) { super(...args); } )
       - the constructor function is the method invoked */
    constructor(name) {
      this.name;
    }
  }

  // classes also support expression syntax like functions
  const example2 = class {};
  const example3 = class Example3 {};

  log(Example.staticProperty);
  log(Example.staticMethod());

  new Example().thisIsLegal({});
}

log("\nMORE CLASSES");
/* Classes and inheritance are mostly syntatic sugar for creating objects with a prototype chain,
but there is some class specific functionality. 

- What is the same:
  - 'new' keyword turns a function into a constructor, which:
    - creates a blank object
    - sets the object's [[Prototype]] to the constructor's prototype property
  - class methods are just functions added to the prototype of the constructor function
  - 

These blocks are essentially equivalent) */
{
  class Person {
    constructor(name) {
      this.name = name;
      /* this section would override the greet function from the prototype when called from a Person instace */
      // this.greet = function () {
      //   console.log("hi", this.name);
      // }
    }
    greet() {
      console.log("hi from proto", this.name);
    }
  }
  console.log("has proto 'greet'?", Object.hasOwn(Person.prototype, "greet"));
  const person = new Person("Carl");
  person.greet();
  console.log(Object.getPrototypeOf(person).constructor);
}
{
  function Person(name) {
    this.name = name;
  }
  Person.prototype.greet = function () {
    console.log("hi from proto", this.name);
  };
  const person = new Person("Carl");
  person.greet();
  console.log(Object.getPrototypeOf(person).constructor);
}
// Object.getPrototypeOf() provides access to the [[Prototype]] well known symbol property on all
// objects. It is the same as __proto__, but that shouls NOT be used because it was never
// standardized and is deprecated.

/* Subclassing overview:

Blocks are ~equivalent Note: Object.getPrototypeOf(Object.create(Prototype.prototype)) ===
Object.getPrototypeOf(new Prototype()) === Prototype.prototype.

The only difference is that `new` additionally runs the constructor function. */
{
  class Animal {
    eat() {
      console.log("yum");
    }
  }
  class Cat extends Animal {
    /* Derived class constructor order of operations:
        1. lines before the super call are evaluated
        2. the super call to the parent is evaluated and initializes 'this' fully, so super call
           should ALMOST ALWAYS be first
        3. current class fields are initialized
        4. lines after the super call are evaluated 

      Most of the complexity here can be avoided by calling super() first since then all parent
      class initalization and current class field initialization is complete.
        */
    constructor() {
      super();
    }
  }
  let cat = new Cat();
}
{
  function Animal() {}
  // We don't set eat() in the constructor, because a new function instance would be created for each instance of Animal
  Animal.prototype.eat = function () {
    console.log("YUM!!!");
  };
  function Cat() {
    // equivalent to super() in constructor
    Animal.call(this);
  }
  // set Cat's prototype property to an instance of Animal to access eat();
  // do not use `Object.assign(Cat.prototype, Animal.prototype)` because while it copies Animal's own properties,
  // it won't add Animal in the prototype chain for Cat
  Cat.prototype = Object.create(Animal.prototype); // alternatively, use `new Animal()` or `new animalInstance.constructor()`
  // set Cat's constructor back to Cat (not all that necessary,
  // but makes consistent with ES6 classes and the default Constructor.prototype.constructor behavior)
  Cat.prototype.constructor = Cat;
  let cat = new Cat();
  console.log(Cat.prototype instanceof Animal);
}

class Extend1 {
  constructor() {
    this.name = "1";
  }
}
Extend1.prototype.name = "static1";
class Extend2 extends Extend1 {
  constructor() {
    super();
    this.name = "2";
  }
}
Extend2.prototype.name = "static2";





/* PROTOTYPE CHAIN:

Instance:
- [[Prototype]] is equal to the prototype property of its constructor function (i.e, `new
  Object.getPrototypeOf(Thing()) === Thing.prototype`)
- prototype property does not exist

Constructor function:
- Can't completely make sense of it, but
    - for subclasses, [[Prototype]] is equal to the constructor function of its superclass
    - for classes without explicit superclasses and for non-class functions, [[Prototype]] is equal
      to Function.prototype, whose [[Prototype]] is Object.prototype and whose [[Prototype]] is null
- prototype property is an instance created from its [[Prototype]] constructor function (i.e.,
  `Subthing.prototype = Object.create(Thing.prototype); Subthing.prototype.constructor = Subthing;`)
*/
// only constructors (not instances) have a prototype property
console.log(Extend2.prototype);
console.log(Extend2.prototype.constructor);
console.log(Extend1.prototype);
console.log(Extend1.prototype.constructor);
// [[Prototype]] of an instance is equal to the prototype property of the constructor function
console.log(Object.getPrototypeOf(new Extend2()) === Extend2.prototype);
// prototype property of the constructor function is an instance created from its [[Prototype]] constructor function
console.log(Extend2.prototype instanceof Extend1);
// a constructor function's prototype's constructor property is equal to itself (set under-the-hood and/or manually pre-ES6)
console.log(Extend2.prototype.constructor === Extend2);
// illustrating constructor function's [[Prototype]] chain
console.log(Object.getPrototypeOf(Extend2) === Extend1);
console.log(Object.getPrototypeOf(Object.getPrototypeOf(Extend2)) === Function.prototype);
console.log(
  Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(Extend2))) === Object.prototype
);
console.log(
  Object.getPrototypeOf(
    Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(Extend2)))
  ) === null
);

function Construct() {}
for (const key of Reflect.ownKeys(Construct)) {
  log(key);
}
for (const key of Reflect.ownKeys(Construct.prototype)) {
  log(key);
}
log(Construct.prototype);
log(Construct.prototype.constructor === Construct);
function ExtendedConstruct() {}
ExtendedConstruct.prototype = Object.create(Construct.prototype);

log("\nSUPER KEYWORD");
/* 'super' is not actually a property that holds a parent class reference; it is a keyword, but it
functions similarly to a property, except in that it DOESN'T rebind 'this'.

'super' can refer to:
1. the parent class's constructor if called within an instance scope, i.e., where 'this' is the
   CHLID class instance)
2. the PARENT class's prototype if called within a static scope, i.e., where 'this' is the CHILD
   class constructor
 */
{
  class Simple {
    thing3 = "constant 3";

    constructor(thing1, thing2) {
      this.thing1 = thing1;
      this.thing2 = thing2;
    }

    // this field cannot be overridden (though a symbol property would also avoid name clash and
    // accidental shadowing)
    #privateField = "private simple field";
    stableMethod() {
      console.log(this.#privateField);
    }

    beCarefulMethod() {
      console.log(this.thing3);
    }
  }

  class SimpleExtended extends Simple {
    constructor(thing1, thing2, thing3) {
      // super calls parent constructor, which initializes 'this' with the parent class's
      // properties, which means that all instance properties in class chain are 'own' properties of
      // the subclass instance
      super(thing1, thing2);
      this.thing3 = thing3;
      log(Object.keys(this));

      // method below will always return the parent class's 'thing3'
      super.stableMethod();

      // 'super' does not change the binding of 'this', so 'this.thing3' when called in the parent
      // class function, returns the child class's 'thing3'. This is the same as with Java/Kotlin
      // overriding, but can be suprising in JS since, instead of overriding, properties are
      // shadowed without explicit annotation
      super.beCarefulMethod();
    }
  }
  const simple = new SimpleExtended(1, 2, 3);
}

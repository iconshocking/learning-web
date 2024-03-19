/* eslint-disable no-this-before-super */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-inner-declarations */

import { log } from "console";

log("\nCLASSES");
/* Overview of classes:

(Side note: Classes are always run in strict mode.)

Classes and subclasses are essentially syntatic sugar for creating objects with a prototype chain,
but there is some class specific functionality.

NOTE: classes are not hoisted, unlike function declarations, so they must be declared before they
are accessed.

Class definition evaluation order (NOT INSTANCE CREATION - see the inheritance section below):
1. 'extends' is evaluted to make sure parent is a constructor function or null
2. Default constructor is provided if none present present
    - NOTE: a subclass MUST EITHER provide no constructor (the default replacement is a super()
      call) or call super() because until super() is called, 'this' is not defined
3. any computed property keys are computed
    - NOTE: this is the ONLY point in class creation where 'this' still refers to the surrounding
      scope's 'this' at the point of definition
4. 'constructor' and static/instance methods/accessors are added to the prototype, which are set as
   properties on the class constructor function
5. Static fields/blocks are evaluated, with 'this' referring to the class constructor.

NOTE: Evaluation is always performed in declared order (for class creation and class INSTANCE
creation), so do not reference a later static/instance field/block in an earlier one (methods are
fine UNLESS they are invoked within the class/instance creation.)
*/
{
  const outsideValue = "outside value";
  class Example {
    /*  Class fields are set on the INSTANCE, not the prototype.

    You should USUALLY define fields instead of just creating them in the constructor, even if they
    aren't initialized until the constructor, because it makes it clear what properties the class
    has. */
    name; // undefined if no value set
    constant = "constant";
    // outside scope 'this' for all key computations, but instance 'this' for field value computation
    ["computed" + "PropertyName" + (log("computed with this =", this) ?? "")] = this.constant + "2";

    // prototype method
    greet() {
      return "hi my name is " + this.name;
    }

    /* NOTE: 'static' is a newer feature and should ONLY be used if the desired browsers all support
    it.

    'static' keyword assigns properties and methods to the constructor itself, NOT the prototype.
    This means two things: 
    1. they are not in the prototype chain, thus cannot be called via instances (exactly like
       Java/Kotlin 'static')
    2. 'this' in static scopes refer to the constructor function itself */
    static staticProperty = "static value of " + this.name;
    static staticMethod() {
      return "static method using " + this.staticProperty;
    }
    // newest feature
    static {
      log("static initialization block using " + this.staticMethod());
    }

    // NOTE: accessors/methods are added to the prototype of the constructor function, NOT the instance
    // itself, so they are not spreadable
    get accessor() {
      return "accessor value";
    }
    set accessor(value) {
      log("value not set");
    }

    /* NOTE: private fields/methods are a newer feature and should ONLY be used if the desired
    browsers all support them.

    Classes support private fields/methods restricted to their defining class (like Java/Kotlin),
    with no access given to subclasses.

    NOTE: Private (non-static) fields/methods/accessors are ALWAYS instance properties because they
    are NOT on the prototype. */
    #privateField = "private field";
    #privateInstanceMethod() {
      log("private instance method");
    }
    // trying to access a private property outside the defining class will throw an Error)
    legalClassTypeCheck(obj) {
      // note the special syntax with 'in' here, where we are using the private field itself instead
      // of a property name/symbol
      log("private field " + (#privateField in obj ? "found" : "not found"));
    }

    notLegalClassTypeCheck(obj) {
      // BAD: throws if Example is not in obj's prototype chain
      try {
        log(obj.#privateField);
      } catch (e) {
        log(e.message);
      }
    }

    callPrivateInstanceMethod() {
      // will not throw from a subclass instance because the function is defined on the parent
      this.#privateInstanceMethod();
    }

    // private static fields should always use the class name to avoid errors
    static #privateStaticField = "private static field";
    static callPrivateStaticMethod() {
      // stable way to do this
      log("stable way:", Example.#privateStaticField);
    }
    static badCallPrivateStaticMethod() {
      // throws if called from a subclass's static method because 'this' is the subclass
      // constructor, not Example, and the subclass has no knowledge of parent private properties
      try {
        log("unstable way:", this.#privateStaticField);
      } catch (e) {
        log(e.message);
      }
    }

    // Parent CONSTRUCTOR initialization of 'this' and setting the [[Prototype]] of the child
    // Constructor is done by now, so evaluation of statics will occur with 'this' set to the
    // constructor function originally called.

    /* - class constructor is only invoked when using the 'new' keyword
       - constructor is optional; if not provided, a default constructor is created:
          1. if a non-derived class, an empty constructor
          2. if a derived class, a constructor that calls the parent constructor with all arguments
             (i.e., constructor(...args) { super(...args); } )
       - the constructor function is the method invoked */
    constructor(name) {
      this.name;
    }

    // NOTE: since there is no way to define a field on the prototype via class syntax, it must be
    // done manually (static block is a good way to do so).
    static {
      this.prototype.prototypeField = "prototype field";
    }
  }

  let example1 = new Example("example1");
  try {
    // class constructors, unlike default constructor functions, must be called with 'new'
    example1 = Example("example1-again");
  } catch (e) {
    log(e.message);
  }
  // classes also support expression syntax like functions
  const Example2 = class {};
  const Example3 = class Example3 {};

  log(Reflect.ownKeys(example1));
  log(Reflect.ownKeys(Example));
  log(Reflect.ownKeys(Example.prototype));
  log(Example.staticProperty);
  log(Example.staticMethod());
  log(Example.callPrivateStaticMethod());
  log();
  example1.legalClassTypeCheck({});
  example1.legalClassTypeCheck(new Example());
  example1.notLegalClassTypeCheck({});
  example1.callPrivateInstanceMethod();
  log();
  class SubExample extends Example {
    static publicStaticMethod() {
      super.callPrivateStaticMethod();
      super.badCallPrivateStaticMethod();
    }
  }
  SubExample.publicStaticMethod();
  new SubExample().callPrivateInstanceMethod();
  log();
  log(example1.prototypeField);
}

log("\nSUBCLASSING");
/* Classes set up most of the manual inheritance you would normally have to do with constructor
functions

NOTE: since classes are just syntactic sugar for prototype-based inheritance, multiple inheritance
is not possible, but Typescript solves most of the typing issue via interfaces.
*/

{
  class Base {
    base = "base";
    set willBeCalled(value) {
      log("will be called");
      this.called = value;
    }
    set willNotBeCalled(value) {
      log("will not be called set with", value);
    }

    constructor() {
      log("constructor");
    }
    static staticMethod() {
      log("static method");
    }
    prototypeMethod() {
      log("prototype method");
    }
  }
  class Extended extends Base {
    /* Derived class constructor order of operations:
        1. lines before the super call are evaluated
        2. the super call to the parent is evaluated, which creates and initializes 'this', so super
           call should ALMOST ALWAYS be first
        3. current class fields are initialized
        4. lines after the super call are evaluated 

      Most of the complexity here can be avoided by calling super() first since then all parent
      class initalization and current class field initialization is complete.
    */
    constructor() {
      // DO NOT call 'this' before super()
      super();
      log("extended constructor");
      this.extended = this.base + " + extended";
      this.willBeCalled = 5;
    }

    // NOTE: fields sidestep setters in parent classes (effectively using Object.defineProperty()),
    // so if you want a parent setter to be called, initialize in the constructor)
    willNotBeCalled = 5;
  }

  // automatic constructor/instance properties inheritance via super()
  const extended = new Extended();
  log(extended);
  // automatic prototype inheritance
  extended.prototypeMethod();
  log(Object.getPrototypeOf(Extended.prototype) === Base.prototype);
  log(Object.getPrototypeOf(Base.prototype) === Object.prototype);
  // automatic statics inheritance
  Extended.staticMethod();
  log(Object.getPrototypeOf(Extended) === Base);

  log(extended.willNotBeCalled);
  Object.getPrototypeOf(extended).willNotBeCalled = 6;
}

log("\nSUPER KEYWORD");
/* 'super' is not actually a property that holds a reference; it is a keyword, but it functions
similarly to a property, except in that it DOESN'T rebind 'this' when a function is called via it.

'super' refers to different things according to context:
  1. Used as 'super()' when in the constructor: the Constructor.[[Prototype]] property, (i.e.,
     ParentConstructor)
  2. Used as 'super.property/method()' when in a NON-STATIC context:
     instance.[[Prototype]].property/method().
  3. Same as #2 but in a STATIC context: Constructor.[[Prototype]].property/method()
*/
{
  class Simple {
    thing3 = "this will be overridden";

    constructor(thing1, thing2) {
      this.thing1 = thing1;
      this.thing2 = thing2;
    }

    get thing4() {
      return "thing4";
    }

    getThing5() {
      return "thing5";
    }

    // this field cannot be overridden (though a symbol property would alternatively also solve name
    // clash and accidental shadowing)
    #privateField = "private simple field";
    stableMethod() {
      log(this.#privateField);
    }

    methodAffectedBySubclassingDueToUseOfThis() {
      log(this.thing4);
    }

    methodThatWillNotBeReplaced() {
      log("methodThatWillNotBeReplaced still here");
    }

    static staticMethod() {
      log("static method");
    }
  }

  class SimpleExtended extends Simple {
    // REMEMBER: accessors (like methods) are NOT instance properties, so they shadow instead of
    // override
    get thing4() {
      return "thing4 extended";
    }

    getThing5() {
      return super.getThing5();
    }

    constructor(thing1, thing2, thing3) {
      // instance 'this' does NOT exist until the super constructor has been called
      try {
        this.thing3 = thing3;
      } catch (e) {
        log(e.message);
      }
      // 'super()' calls parent constructor with the same 'this' and since there is only one instance
      // object being created, all instance properties set in the constructor chain are 'own'
      // properties on the sublass instance being created (i.e., the 'this')
      super(thing1, thing2);
      this.thing3 = thing3;
      // REMEMBER: 'super' in instance scope references the instance, not the prototype
      super.methodThatWillNotBeReplaced = () => log("was put on instance"); // this just creates a method on the instance
      // method below will always return the parent class's private field since it can't be overriden
      super.stableMethod();
      // 'super' does not change the binding of 'this' and 'this' is the child class, so when
      // looking in the prototype chain for 'thing4', the child's prototype's version will be found
      // first and used. This is the same as with Java/Kotlin overriding, but can be suprising in JS
      // since, properties are shadowed without explicit annotation
      super.methodAffectedBySubclassingDueToUseOfThis();
    }

    static staticMethod() {
      super.staticMethod(); // super here refers to the parent Constructor
    }
  }
  const extended = new SimpleExtended(1, 2, 3);

  log(Object.hasOwn(extended, "thing3")); // true
  log(Object.hasOwn(extended, "methodThatWillNotBeReplaced")); // true
  extended.methodThatWillNotBeReplaced();
  log(Object.hasOwn(Simple.prototype, "methodThatWillNotBeReplaced"));
  Simple.prototype.methodThatWillNotBeReplaced();

  log(extended.thing4);
  log(Simple.prototype.thing4); // still exists
  SimpleExtended.staticMethod();

  // NOTE: 'super' unlike 'this' is not dependent on the context in which it is called, so a method
  // called from outside a class context does not change its 'super' call behavior
  const unboundGetThing5 = extended.getThing5;
  log(unboundGetThing5());
}

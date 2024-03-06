/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-inner-declarations */

// primitive types that aren't objects wrap themselves in the relvant object when a property is
// accessed so that the prototype can be used
let str = "hi";
// indices are properties of the String object instance itself
console.log(Object.getOwnPropertyNames(str));
// all other properties are on the String prototype
console.log(Object.getOwnPropertyNames(String.prototype));

// shadowing (overriding in traditional class-based languages)
const myDate = new Date(1995, 11, 17);
console.log(myDate.getYear());
myDate.getYear = () => "Shadowed!";
console.log(myDate.getYear());

// blocks are ~equivalent
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
  console.log(person.__proto__.constructor);
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
  console.log(person.__proto__.constructor);
}

// blocks are ~equivalent
// Note: Object.create(Prototype.prototype).__proto__ === new Prototype().__proto__ === Prototype.prototype.
// The only difference is that `new` additionally runs the constructor function.
{
  class Animal {
    eat() {
      console.log("yum");
    }
  }
  class Cat extends Animal {
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

// Instance:
// - [[Prototype]] is equal to the prototype property of its constructor function
//   (i.e, `new Thing().__proto__ === Thing.prototype`)
// - prototype property does not exist
//
// Constructor function:
// - Can't completely make sense of it, but
//     - for subclasses, [[Prototype]] is equal to the constructor function of its superclass
//     - for classes without explicit superclasses and for non-class functions,
//       [[Prototype]] is equal to Function.prototype, whose [[Prototype]] is Object.prototype and whose [[Prototype]] is null
// - prototype property is an instance created from its [[Prototype]] constructor function
//   (i.e., `Subthing.prototype = Object.create(Thing.prototype); Subthing.prototype.constructor = Subthing;`)

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
// illiustrating constructor function's [[Prototype]] chain
console.log(Extend2.__proto__ === Extend1);
console.log(Extend2.__proto__.__proto__ === Function.prototype);
console.log(Extend2.__proto__.__proto__.__proto__ === Object.prototype);
console.log(Extend2.__proto__.__proto__.__proto__.__proto__ === null);

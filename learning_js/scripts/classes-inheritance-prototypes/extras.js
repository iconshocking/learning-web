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

console.log("\nNEW.TARGET");
/* 'new.target' is a meta-property accessible in functions that refers to:
1. the constructor that new was called on IF it is within the scope of a constructor function call
   with the 'new' keyword
2. ELSE undefined (guaranteed to never throw) */
function NewTarget() {
  console.log(new.target ? "calling as a constructor" : "calling as a function");
}
NewTarget();
new NewTarget();
// Calling a CLASS constructor without 'new' throws an error, BUT 'new.target' can still be useful
// by letting us know if a subclass is being constructed.
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new B(); // logs "B"
// NOTE: Do NOT use 'new.target' in arrow functions since they inherit it from the surrounding scope
// of their definition

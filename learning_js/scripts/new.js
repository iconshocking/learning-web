function Person(name) {
  this.name = name;
  this.introduceSelf = function () {
    console.log(`Hi! I'm ${this.name}.`);
  };
}

const salva = new Person("Salva");
salva.name;
salva.introduceSelf();

function EmptyDefault() {}
console.log(new EmptyDefault());

function FailedPrimitiveOverride() {
  return 5;
}
console.log(new FailedPrimitiveOverride());

function Override() {
  this.name = "original";
  return { name: "overridden" };
}
console.log(new Override());

function ConstructorOrFunction(color) {
  if (!new.target) {
    // Called as function.
    return `${color} car`;
  }
  // Called with new, i.e., as constructor
  this.color = color;
}

console.log(ConstructorOrFunction("red"));
console.log(new ConstructorOrFunction("red"));

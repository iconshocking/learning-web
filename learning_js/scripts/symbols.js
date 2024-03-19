/* eslint-disable @typescript-eslint/no-unused-vars */

import { log } from "console";

// a symbol is a globally unique primitive constructed using the Symbol() constructor
// (note: unlike other primitives, there is no Symbol wrapper object)
const localSymbol = Symbol("description");
log(Symbol("description") !== localSymbol); // always unique

// the global symbol registry can be used to share symbols across scopes (or access them
// without holding a prior reference)
const globalSymbol = Symbol.for("description");
// keyFor() allows passing around the string key to access the symbol
log(Symbol.keyFor(globalSymbol) === "description");
log(Symbol.for("description") === globalSymbol);
// local symbols are not in the registry
log(localSymbol !== globalSymbol);
// (NOTE: do not confuse symbol description with registry key - multiple symbols can have the same
// description, but only one symbol is ever created in the registry for a given key, and it will
// never be garbage collected)

// symbols are very useful to
// 1) avoid name collisions
const symbol = Symbol("key");
const object = {
  [symbol]: "value",
};
const symbol2 = Symbol("key");
object[symbol2] = "value2";
log(object[symbol]);
log(object[symbol2]);

// 2) create (sort of) private properties for objects that aren't classes
const objectWithPrivateKey = (() => {
  const privateProperty = Symbol("secret-key");
  return {
    publicProperty: "value",
    [privateProperty]: "secret-value",
  };
})();
// won't log the private property
for (const key in objectWithPrivateKey) {
  log(key);
}
log(JSON.stringify(objectWithPrivateKey));
//symbols CAN be accessed but it's not straightforward, which means they will likely only be
// accessed when intending to access symbol properties
for (const key of Reflect.ownKeys(objectWithPrivateKey)) {
  if (typeof key === "symbol") log(objectWithPrivateKey[key]);
}

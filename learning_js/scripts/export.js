import { log } from "console";

export function exportedFunction() {
  log("This function is exported");
}

export let exportedVariable = "This variable is exported";

export default exportedFunction;

// can also export using any of the same constructs and combinations as import
export { exportedVariable as exportDefinedAlias };

/* The following is a new export syntax, but it requires importing in an awkward way since a string
literal is not a valid identifier:

export { exportedVariable as "stringLiteral" };

import { "stringLiteral" as exportedLiteral } from "./export.js"
*/

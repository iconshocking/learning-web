/* eslint-disable no-inner-declarations */
import { log } from "console";
// imports are hoisted so most formatters will move them to the top to make that explicit (and for tidiness)

// any of these forms can be combined in a single import statement
import defaultExport, * as allExports from "./export.js"; // default export with whatever name you import it with
// 'import * from "./export.js"' is not valid on purpose to avoid name collisions
import {
  default as defaultAlias,
  exportDefinedAlias,
  exportedFunction,
  exportedFunction as exportedFunctionAlias,
  exportedVariable,
} from "./export.js"; // non-default, aka 'named', exports
// special: runs script for side-effects only, does not import anything
import "./export.js";

defaultExport();
allExports.exportedFunction();
exportedFunction();
log(exportedVariable);
log(exportDefinedAlias);
exportedFunctionAlias();
defaultAlias();

{
  function exportedFunction() {
    log("Shadows imported function");
  }
  exportedFunction();
}

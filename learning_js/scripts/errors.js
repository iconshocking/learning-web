/* eslint-disable no-unreachable */

// language supports try-catch-finally like Java

import { log } from "console";

try {
  log("try");
  throw new Error("error");
  log("after throw");
} catch (e) {
  log("caught error");
} finally {
  log("finally");
}

// DO NOT put control flow statements (return/throw/break/continue) in the  'finally' block since it
// will override any other control flow statements in the try/catch blocks (this is very unexpected
// behavior)
function finallyOverride(throwError = false) {
  try {
    if (throwError) throw new Error("error");
    return "try";
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return "finally";
  }
}
log(finallyOverride());
log(finallyOverride(true));

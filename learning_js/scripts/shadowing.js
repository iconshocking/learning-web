/* eslint-disable no-inner-declarations */

// variables and functions can be shadowed, but not in the same scope (which will throw a syntax error)

import { log } from "console";

let a = 1;
// 'let a = 2' will crash with 'a has already been declared'
function b() {
  return 2;
}

{
  let a = 3;
  function b() {
    return 4;
  }
  log(a);
  log(b());
}
log(a);
log(b());

// imports cannot shadow each other since they are in the same scope
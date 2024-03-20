/* eslint-disable no-compare-neg-zero */
import { log } from "console";

/* There are 7 primitive data types in JavaScript:
- Number: always 64-bit floating point, but can represent integers exactly up to 2^53
- String: immutable, supports template literals
- Boolean
- Symbol: unique and immutable, can be stored in the global symbol registry
- BigInt: for integers of arbitrary size
- undefined: what all uninitialized variables are set to (never set manually)
- null: used to signify an intentional absence of a value (OKAY to set manually)

Everything else is an object (including arrays). */

// BigInt is for integers of greater size than the limits enforced by Number, but you can't perform
// operations between BigInt and Number without conversion, so stick to one depending on your use
// case for that area of code.
const a = 3n ** 100n; // the n suffix makes it a BigInt
log(a);

try {
  log(3 * 3n);
} catch (e) {
  log(e.message);
}

// template literals still evaluate to string primitives
log(`2 + 2 = ${2 + 2}`);

log(0xff); // hexadecimal
log(0o77); // octal
log(0b111); // binary
log("isNaN?", isNaN(Number("string"))); // true
log(1 / 0 === Infinity);
log(-1 / 0 === -Infinity);

// math operations
1 + 1;
1 - 1;
1 * 1;
// all division is floating point in JS, but will be represented excatly as an integer if
// possible and within the bounds where exact integer representation is possible
log(4 / 2 === 2);
1 % 1;
1 ** 1; // exponentiation
let num = 1;
log(num++); // post-return-increment, so 1 is logged
log(num); // 2
log(++num); // pre-return-increment, so 3 is logged
log(num); // 3
num = 1;
num += 1;
num -= 1;
num *= 1;
num /= 1;

import { log } from "console";

/* There are 7 primitive data types in JavaScript:
Number, String, Boolean, Symbol, BigInt, undefined, and null.
Everything else is an object (including arrays). */

// null should be used to signify an intentional absence of a value,
// whereas undefined should never be assigned manually (it is a result of a lack of initialization)

// BigInt is for integers of greater size than the limits enforced by Number, but you can't perform
// operations between BigInt and Number without conversion, so stick to one depending on your use
// case for that area of code.
const a = 3n ** 100n; // the n suffix makes it a BigInt
log(a);

try {
  log(3 * 3n);
} catch (e) {
  log("caught error");
}

// template literals still evaluate to string primitives
log(`2 + 2 = ${2 + 2}`);

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
num = 1
num += 1;
num -= 1;
num *= 1;
num /= 1;

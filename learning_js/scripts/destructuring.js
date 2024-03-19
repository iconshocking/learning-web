/* eslint-disable @typescript-eslint/no-unused-vars */

// des

// Can skip values in iterables (does not work for function parameters)
{
  const [a, , , , c] = [1, 2, 3, 4, 5];
  console.log(a, c);
}

// Can use rest syntax to capture remaining values (like for functions), but it must be the last
// element
{
  const [first, ...others] = [1, 2, 3, 4, 5];
  console.log(first, others);
}
{
  const { a, ...others } = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
  };
  console.log(a, others);
}

// destructuring supports nesting
{
  const [x, [y, z]] = [1, [2, 3]];
  console.log(x, y, z);
}
{
  const [x, { y, z }] = [1, { y: "hi", z: "bye" }];
  console.log(x, y, z);
}

// destucturing supports default values
{
  // this pattern is awkward for arrays, so use VERY catiously
  const [first = 1, second = 2] = [3];
  console.log(first, second);
  const { a = 1, b = 2 } = { a: 3, c: 4 };
  console.log(a, b);
}

// destructuring supports too many variables (or absent properties), which will just be undefined
{
  const [a, b] = [1];
  const { c, d } = { c: 1 };
  console.log(a, b, c, d);
}

// object destructuring can be used to rename properties
{
  const { a: x, b: y } = { a: 1, b: 2 };
  console.log(x, y);
}
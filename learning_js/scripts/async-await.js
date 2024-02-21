// async functions always returns a promise, but they will differ slightly depending on what is returned:
// 1. returns resolved promise with value 1
async function foo1() {
  return 1;
}
console.log(foo1());
// 2. returns pending promise which will resolve to value 1
async function foo2() {
  return Promise.resolve(1);
}
console.log(foo2());

// Note: async functions return wrapper promises even when a promise is returned, so equality checks should not be used.
const p = new Promise((res, rej) => {
  res(1);
});
async function asyncReturn() {
  return p;
}
function basicReturn() {
  // returns p since it is already a promise
  return Promise.resolve(p);
}
console.log(p === basicReturn()); // true
console.log(p === asyncReturn()); // false

// async functions run snychronously up through the first await expression,
// upon which execution will always continue asynchronously
(async () => {
  console.log("hi");
  console.log("hi again");
})();
console.log("hi last");
(async () => {
  await console.log("hey");
  console.log("hey again");
})();
console.log("hey NOT last");

// Error handling should be considered carefully, because the handlers added to the async function's promise
// will not account for any Promise created before/during the current await expression
// that was not chained to or composited with the current await Promise. For example:
async function foo() {
  const p1 = new Promise((resolve) => setTimeout(() => resolve("1"), 1000));
  const p2 = new Promise((_, reject) => setTimeout(() => reject("2"), 500));
  // p2 is not part of any promise chain while awaiting the settling of p1
  // const results = [await p1, await p2];
  // this alternative line does NOT have the same issue:
  await Promise.all([p1, p2]);
}
foo().catch(() => {}); // Attempt to swallow all errors, which fails

// The expression after await is implicitly wrapped to make a promise:
// 1. a native promise is returned as-is
console.log(
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(10);
    }, 200);
  }),
);
// 2. a thenable that is not a promise is converted to one via `new Promise((resolve, _) => thenable.then(resolve))`
console.log(
  await {
    then(resolve, _reject) {
      resolve("resolved!");
    },
  },
);
// 3. a non-thenable is wrapped in a fulfilled promise
let obj = {};
console.log((await obj) === obj);

// use try-catch inside async functions to handle errors
async function f4() {
  try {
    const z = await Promise.reject(new Error("async error"));
  } catch (e) {
    console.error(e.message);
  }
  // you could also catch errors via new Promise().catch(), but that won't catch the following:
  try {
    const zz = await Promise.resolve(
      (() => {
        throw new Error("synchronous error");
      })(),
    );
  } catch (e) {
    console.error(e.message);
  }
  // Uncomment the following to see the difference:
  // const zzz = await Promise.resolve(
  //   (() => {
  //     throw new Error("synchronous error");
  //   })()
  // ).catch((e) => {
  //   // swallow error
  // });
}
f4();

// How top-level await in modules works:
// 1. The execution of the current module is deferred until the awaited promise is resolved.
// 2. The execution of the parent module is deferred until the child module that called await,
//    and all its siblings, export bindings.
// 3. The sibling modules, and siblings of parent modules, are able to continue executing in the same synchronous order —
//    assuming there are no cycles or other awaited promises in the graph.
// 4. The module that called await resumes its execution after the awaited promise resolves.
// 5. The parent module and subsequent trees continue to execute in a synchronous order
//    as long as there are no other awaited promises.
export default await new Promise((resolve, _) => {
  setTimeout(() => {
    resolve("exported");
  }, 100);
});

// queueMicrotask() pushes to the same queue (FIFO) as Promises (the microtask queue), so scheduling order is preserved.
// The microtask queue performs all operations in the queue in between each task (macrotask) in the event loop.
queueMicrotask(() => console.log("microtask async execute")); // added to queue
(async () => {
  console.log("async function synchronous start");
  await null; // following lines are added to queue once this await expression is evaluated
  console.log("async function async end");
})();
new Promise((resolve, _) => {
  console.log("promise synchronous start");
  resolve();
}).then(() => console.log("promise async end")); // added to queue after promise resolves

await null; // wait for prior example to finish
// Wrap returns from async functions when explicitly returning a promise to preserve the stack trace (very small performance hit).
async function asyncTask() {
  await null;
  throw new Error(`thrown at ${performance.now()}`);
}
async function withAwait() {
  console.log("started withAwait()");
  // remove await here to see that the thrown error does not include withAwait() in the stack trace
  // because it was thrown after exiting the function
  const task = await asyncTask();
  console.log("ended withAwait()");
  return task;
}
try {
  withAwait();
} catch (e) {
  console.error(e);
}

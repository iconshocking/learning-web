/*
Example of chaining promises:

doSomething()
    .then((result) => doSomethingElse(result))
    .then((newResult) => doThirdThing(newResult))
    .then((finalResult) => {
        console.log(`Got the final result: ${finalResult}`);
    })
    .catch(failureCallback);

Note: The return value of a `then` callback can either be a Promise or non-Promise.
- If it is a non-Promise, then the returned Promise will be fulfilled with that values
- If it is a Promise, then the returned wrapper Promise will be settled with the fulfilled/rejected value of that Promise.
Therefore, always make sure to return from a `then` callback since,  otherwise,
the next `then` callback will receive `undefined` and will execute immediately,
regardless of any pending Promises in the prior callback.

Can also be written as:

async function executePromises() {
    try {
        const result = await doSomething();
        const newResult = await doSomethingElse(result);
        const finalResult = await doThirdThing(newResult);
        console.log(`Got the final result: ${finalResult}`);
    } catch (error) {
        failureCallback(error);
    }
}
*/

// You can chain `then` callbacks after an exception (because `catch` returns a Promise)
Promise.resolve("Resolved")
  .then(() => {
    throw new Error("Something failed");
  })
  .catch(() => {
    console.error("Do that");
  })
  .then(() => {
    console.log("Do this, no matter what happened before");
  });

/*
You can nest Promises if you need more specific error recovery, like the following:

doSomethingCritical()
  .then((result) =>
    doSomethingOptional(result)
      .then((optionalResult) => doSomethingExtraNice(optionalResult))
      .catch((e) => result),
  )
  .then((result) => moreCriticalStuff(result))
  .catch((e) => console.error(`Critical failure: ${e.message}`));
*/

// Event occurs when a Promise is rejected but there is no rejection handler attached.
// Can be useful for debugging. Event will go to Worker if Promise was created in Worker.
addEventListener("unhandledrejection", (event) => log(event.reason));
onunhandledrejection = (event) => log(event.reason);

// Event occurs when a rejection handler is added to a Promise after the Promise has already rejected.
// Can be useful for debugging. Event will go to Worker if Promise was created in Worker.
window.onrejectionhandled = (e) => log(event.reason);
window.addEventListener("rejectionhandled", (e) => log(event.reason));

// The following is the syntax for Node.js. This does override the default logging to the console though,
// so make sure to implement some form of logging.
process.on("unhandledRejection", (reason, promise) => {
  // Add code here to examine the "promise" and "reason" values
});

// Promise composition methods. Promises all evaluate concurrently.
//
// .all()
// Fulfills when ALL of the promises fulfill; rejects when ANY of the promises rejects with that initial reason.
// Fulfillment value is the array of fulfillment values (including values that were not Promises).
// Only ever runs synchronously if the iterable passed is empty, same for .allSettled() and .any().
const p1 = Promise.resolve(3);
const p2 = 1337;
const p3 = new Promise((resolve) => {
  setTimeout(() => {
    resolve("foo");
  }, 100);
});
Promise.all([p1, p2, p3]).then((values) => {
  console.log(values); // [3, 1337, "foo"]
});

// Good for avoiding chaining `await`s when the Promises are independent.
//
// async function getPrice() {
//   const [choice, prices] = await Promise.all([promptForDishChoice(), fetchPrices()]);
//   return prices[choice];
// }
//
// VS
//
// async function getPrice() {
//   const choice = await promptForDishChoice();
//   const prices = await fetchPrices(); // wait for prior Promise to resolve before line is run
//   return prices[choice];
// }

// You can avoid the fail-fast behavior of Promise.all() with specific error handling,
// but probably prefer using Promise.allSettled().
Promise.all([
  Promise.resolve(setTimeout(() => resolve("success"), 1000)),
  Promise.reject("error").catch((error) => error),
]).then((values) => {
  console.log(values[0]); // "success"
  console.error(values[1]); // "Error: p2_immediate_rejection"
});

// .allSettled()
// Fulfills when all promises SETTLE and does so with an array of objects representing all the settled Promises. Always fulfills.
// Each object has a status property (either "fulfilled" or "rejected") and a `value` or `reason` property.
const promise1 = Promise.resolve(3);
const promise2 = new Promise((_, reject) => setTimeout(reject, 100, "foo"));
const promises = [promise1, promise2];

Promise.allSettled(promises).then((results) =>
  results.forEach((result) => console.log(result.status)),
);

// .any()
// Fulfills when ANY of the promises fulfills and does so with the first fulfillment value;
// rejects when ALL of the promises reject with an AggregateError,
// which contains an array of rejection reasons in order of the PROMISED passed, NOT in order of the rejections of the errors.
const pErr = new Promise((resolve, reject) => {
  reject("Always fails");
});
const pSlow = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, "Done eventually");
});
const pFast = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "Done quick");
});
Promise.any([pErr, pSlow, pFast]).then((value) => {
  console.log(value);
});
// Logs:
// Done quick

// Settles when ANY of the promises settles, with the settled result.
// Always runs asynchronously, even if the iterable passed is empty (which will forever be pending).
// If passed any already resolved Promises, the first passed will be used for the settled value.
//
// Useful for request timeouts
const data = Promise.race([
  fetch("/api"),
  new Promise((resolve, reject) => {
    // Reject after 5 seconds
    setTimeout(() => reject(new Error("Request timed out")), 5000);
  }),
])
  .then((res) => res.json())
  .catch((err) => displayError(err));

// Useful for fetching state of Promise since this cannot be done by inspecting the Promise object itself.
function promiseState(promise) {
  const pendingState = { status: "pending" };
  // this runs asynchronously but is put immediately into the event queue so is as fast as possible for an async operation.
  return Promise.race([promise, pendingState]).then(
    (value) =>
      value === pendingState ? value : { status: "fulfilled", value },
    (reason) => ({ status: "rejected", reason }),
  );
}

// However, if you want synchronous running of Promises, you can do any of the following:
//
// [func1, func2, func3].reduce((p, f) => p.then(f), Promise.resolve()).then((result) => {});
//
// OR
//
// Promise.resolve()
//   .then(func1)
//   .then(func2)
//   .then(func3)
//   .then((result) => {});
//
// OR
//
// let result;
// for (const f of [func1, func2, func3]) {
//   result = await f(result);
// }

// Promises guarantees around timing:
// - `then()` callbacks will never be invoked before the completion of the current run of the JavaScript microtask.
// - The callbacks will be invoked even if they were added after the success or failure that the promise represents.
// - Multiple callbacks may be added by calling `then()` several times. They will be invoked sequentially, in order.
//
// Promises are added to the microtask queue, which is processed until empty before the next task ('macrotask').
const promise = new Promise((resolve, reject) => {
  console.log("Promise callback");
  resolve();
}).then((result) => {
  console.log("Promise callback (.then)");
});

// setTimeout goes on normal task queue since it is not a Promise API.
setTimeout(() => {
  console.log("event-loop cycle: Promise (fulfilled)", promise);
}, 0);

console.log("Promise (pending)", promise);
// Logs:
// Promise callback
// Promise (pending) Promise {<pending>}
// Promise callback (.then)
// event-loop cycle: Promise (fulfilled) Promise {<fulfilled>}

// Errors thrown inside asynchronous functions will act like uncaught errors
let prom = new Promise((resolve, reject) => {
  setTimeout(() => {
    throw new Error("Uncaught Exception!");
  }, 1000);
});
prom.catch((e) => {
  console.error(e); // This is never called
});

// Errors thrown after resolve is called will be silenced
prom = new Promise((resolve, reject) => {
  resolve();
  throw new Error("Silenced Exception!");
});
prom.catch((e) => {
  console.error(e); // This is never called
});

// .finally() can also be called, which returns a Promise that operates in the same vein as finally with try/catch.
// Does not affect the value of the prior resolved Promise UNLESS if an error is thrown or it returns a rejected Promise.

// Callback APIs can be wrapped with Promise constructor to make them into a Promise API, like so:
function myAsyncFunction(url) {
  return new Promise(
    // This 'executor' function is run SYNCHRONOUSLY when the Promise is created (i.e., as the line is run).
    // Throwing an error in the executor will reject the returned Promise the same as calling reject().
    // The first call to reject(), resolve(), or throw will resolve the Promise and any subsequent calls will be ignored.
    (resolve, reject) => {
      // callback API
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.onload = () => resolve(xhr.responseText);
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
    },
  );
}

// Note:
// 'Resolved' means the value of the Promise is locked in, either fulfilled or rejected or pending on a further chained Promise.
// 'Settled' means the Promise has been fulfilled or rejected.
// Therefore, a Promise can be resolved but not settled if it is pending on the resolution of a further chained Promise.

// Promise.withResolver() allows access to the resolving functions outside the executor scope, which allows some advanced use cases.
// Note: this is not a standard API and very new.
let { p, resolve, reject } = Promise.withResolvers();

// .then() actually can take a second argument, which is a rejection handler,
// but it is often better to use a final .catch() at the end of the chain (possibly with a .finally() afterward)
// because a .catch().then() chain can be prone to errors, such as assuming the rejection value is the fulfillment value.

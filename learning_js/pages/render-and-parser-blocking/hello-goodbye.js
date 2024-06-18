document.body.append(`Hello at ${Date.now()}!\n`);
const start = Date.now();
// JS execution blocks rendering, so the hello and goodbye will be displayed at the same time
while (Date.now() - start < 1000) {
  // do nothing
}
document.body.append(`Goodbye at ${Date.now()}!`);

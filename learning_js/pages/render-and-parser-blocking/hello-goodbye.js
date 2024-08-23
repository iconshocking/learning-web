document.body.append(`Hello at ${Date.now()}!\n`);
const start = Date.now();
// Synchronous JS execution blocks rendering, so the hello above does not render until after the
// goodbye call at the end of the script executes; thus, they render in the same pass
while (Date.now() - start < 1000) {
  // do nothing
}
document.body.append(`Goodbye at ${Date.now()}!`);

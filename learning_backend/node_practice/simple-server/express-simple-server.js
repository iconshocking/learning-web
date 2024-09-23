import express from "express";
import logger from "morgan";
import path from "path";
import router from "./express-simple-router.js";

// traditional way is to name the express application as "app"
const app = express();
app.use(logger("dev"));
const port = 3001;

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});

// MIDDLEWARE is how many 3rd-party libraries will be inserted.

// use() applies for all routes and HTTP verbs
app.use(function (req, res, next) {
  console.log("general middleware");
  next();
});
// can restrict to a specific route prefix (i.e., this applies to all routes that start with "/middleware")
app.use("/middleware", function (req, res, next) {
  console.log("route-specific middleware");
  next();
});
// can restrict to a specific verb as well like a normal route

// routers work like sub-applications, with a separate root route
app.use("/about", router);

// static serving is the only middleware that is built-in (but many middlewares are maintained by the express team)
// - serves files from the local 'statics' directory, preserving the directory structure in the path
app.use("/media", express.static("statics"));
// - NOTE: the static middleware will pass to the next handler if no resource is found (to support
//   fallbacks/errors)
app.get("/media/*", (req, res) => {
  res.send("This resourcse is missing.");
});

// ROUTES

// Use the "all" method to handle all HTTP methods.
// - NOTE: Do not generally use for middleware since the path is matched, not prefix-matched.
// - NOTE: handlers that are set first are executed first for a matching route
app.all("/", function (req, res, next) {
  console.log("root pre-handler");
  // call the next handler in the stack
  next();
});

// route definition - path relative to the site root URL (.get for GET, .post for POST, etc.)
app.get("/", function (req, res) {
  res.send("Hello World!");
});

// ERROR HANDLING
// - NOTE: 404 errors are not considered errors by Express, so they must be handled explicitly

app.use("/errors", (req, res, next) => {
  console.log("error handler");
  res.status(500);
  // errors are passed via the next() function
  next(new Error("Something broke!"));
});
app.use("/errors", (err, req, res, next) => {
  console.log("error catcher");
  next(err);
});
app.use("/errors/intercept", (err, req, res, next) => {
  // delegate to the default error handler if headers have already been sent (i.e., the response has
  // already been started, such as for a stream)
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.send("i stole the final error from default handler");
});
// express has a default error handler at the bottom of the handler stack that 1) logs the error and
// stack trace to the node console and 2) returns it to the client. (Set NODE_ENV to 'production' to
// disable this behavior.)

// VIEW TEMPLATING (if not using an SPA, which is much more common with an express backend)

// Set directory to contain the templates ('views')
app.set("views", path.join(import.meta.dirname, "views"));
// Set view engine to use
app.set("view engine", "some_template_engine_name");
// template values are subbed into the template file to generate the response HTML
app.get("/template", function (req, res) {
  res.render("template_file", { title: "About dogs", message: "Dogs rock!" });
});

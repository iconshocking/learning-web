import express from "express";
import path from "path";

// __dirname and __filename are not available in ES6 module
const __dirname = path.resolve();
const app = express();

app.get("/blocking.html", (req, res) => {
  res.sendFile(__dirname + "/blocking.html");
});

app.get("/purple.css", (req, res) => {
  setTimeout(() => {
    res.sendFile(__dirname + "/purple.css");
  }, 2000);
});

app.get("/font.css", (req, res) => {
  setTimeout(() => {
    res.sendFile(__dirname + "/font.css");
  }, 2000);
});


app.get("/hello-goodbye.js", (req, res) => {
  setTimeout(() => {
    res.sendFile(__dirname + "/hello-goodbye.js");
  }, 1000);
});

app.get("/PlaywriteES-Regular.ttf", (req, res) => {
  setTimeout(() => {
    res.sendFile(__dirname + "/PlaywriteES-Regular.ttf");
  }, 4000);
});


app.get("/green.css", (req, res) => {
  setTimeout(() => {
    res.sendFile(__dirname + "/green.css");
  }, 8000);
});

app.get("/deferred.js", (req, res) => {
  setTimeout(() => {
    res.sendFile(__dirname + "/deferred.js");
  }, 1000);
});

app.get("/domcontentloaded.js", (req, res) => {
  setTimeout(() => {
    res.sendFile(__dirname + "/domcontentloaded.js");
  }, 7000);
});


const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

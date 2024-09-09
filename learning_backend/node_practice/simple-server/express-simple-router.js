import express from "express";
const router = express.Router();

// Home page route
router.get("/", function (req, res) {
  res.send("about home page");
});

// About page route
router.get("/more", function (req, res) {
  res.send("more about");
});

export default router;
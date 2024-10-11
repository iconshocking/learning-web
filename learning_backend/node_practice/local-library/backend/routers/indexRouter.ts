import express from "express";
import IndexController from "../controllers/indexController";

const router = express.Router();

router.get("/", IndexController.index);

router.get("/test", IndexController.test);

export default router;

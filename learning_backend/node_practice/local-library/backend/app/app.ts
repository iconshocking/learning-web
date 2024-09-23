import cookieParser from "cookie-parser";
import express from "express";
import logger from "morgan";
import path from "path";

import indexRouter from "../routes/index";
import cors from "../middleware/cors";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors)

app.use("/", indexRouter);

export default app;

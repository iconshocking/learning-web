import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import logger from "morgan";
import path from "path";
import cors from "../middleware/cors";
import authorRouter from "../routers/authorRouter";
import bookCopyRouter from "../routers/bookCopyRouter";
import bookRouter from "../routers/bookRouter";
import genreRouter from "../routers/genreRouter";
import indexRouter from "../routers/indexRouter";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors);

app.get("/", function (req, res) {
  res.redirect("/catalog");
});
app.use("/catalog", indexRouter, authorRouter, bookRouter, genreRouter, bookCopyRouter);
// catch 404 and forward to error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});
export default app;

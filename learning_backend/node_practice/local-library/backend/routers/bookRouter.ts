import { Router } from "express";
import BookController from "../controllers/bookController";

const router = Router();

router.get("/books", BookController.bookList);

router.post("/book/create", BookController.bookCreate);

router.post("/book/:id/delete", BookController.bookDelete);

router.post("/book/:id/update", BookController.bookUpdate);

router.get("/book/:id", BookController.bookDetail);

export default router;

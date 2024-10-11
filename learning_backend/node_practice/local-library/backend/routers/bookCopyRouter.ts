import { Router } from "express";
import BookCopyController from "../controllers/bookCopyController";

const router = Router();

router.get("/books", BookCopyController.bookCopyList);

router.post("/book/create", BookCopyController.bookCopyCreate);

router.post("/book/:id/delete", BookCopyController.bookCopyDelete);

router.post("/book/:id/update", BookCopyController.bookCopyUpdate);

router.get("/book/:id", BookCopyController.bookCopyDetail);

export default router;

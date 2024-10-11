import { Router } from "express";
import AuthorController from "../controllers/authorController";

const router = Router();

router.get("/authors", AuthorController.authorList);

router.post("/author/create", AuthorController.authorCreate);

router.post("/author/:id/delete", AuthorController.authorDelete);

router.post("/author/:id/update", AuthorController.authorUpdate);

router.get("/author/:id", AuthorController.authorDetail);

export default router;

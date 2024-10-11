import { Router } from "express";
import GenreController from "../controllers/genreController";

const router = Router();

router.get("/genres", GenreController.genreList);

router.get("/genre/:name/books", GenreController.genreBooksList);

export default router;

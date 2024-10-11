import { Request, Response, NextFunction } from "express";

class GenreController {
  // Display list of all genres.
  static async genreList(req: Request, res: Response, next: NextFunction) {
    res.send("NOT IMPLEMENTED: Book list");
  }

  // Display all books page for a specific genre.
  static async genreBooksList(req: Request, res: Response, next: NextFunction) {
    res.send(`NOT IMPLEMENTED: Book detail: ${req.params.id}`);
  }
}

export default GenreController;

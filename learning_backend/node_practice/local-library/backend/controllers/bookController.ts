import { NextFunction, Request, Response } from "express";

class BookController {
  static async bookList(req: Request, res: Response, next: NextFunction) {
    res.send("NOT IMPLEMENTED: Book list");
  }

  static async bookDetail(req: Request, res: Response, next: NextFunction) {
    res.send(`NOT IMPLEMENTED: Book detail: ${req.params.id}`);
  }

  static async bookCreate(req: Request, res: Response, next: NextFunction) {
    res.send("NOT IMPLEMENTED: Book create POST");
  }

  static async bookDelete(req: Request, res: Response, next: NextFunction) {
    res.send("NOT IMPLEMENTED: Book delete POST");
  }

  static async bookUpdate(req: Request, res: Response, next: NextFunction) {
    res.send("NOT IMPLEMENTED: Book update POST");
  }
}

export default BookController;

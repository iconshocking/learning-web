import { Request, Response, NextFunction } from "express";

class BookCopyController {
  static async bookCopyList(req: Request, res: Response, next: NextFunction) {
    res.send("NOT IMPLEMENTED: Book list");
  }

  static async bookCopyDetail(req: Request, res: Response, next: NextFunction) {
    res.send(`NOT IMPLEMENTED: Book detail: ${req.params.id}`);
  }

  static async bookCopyCreate(req: Request, res: Response, next: NextFunction) {
    res.send("NOT IMPLEMENTED: Book create POST");
  }

  static async bookCopyDelete(req: Request, res: Response, next: NextFunction) {
    res.send("NOT IMPLEMENTED: Book delete POST");
  }

  static async bookCopyUpdate(req: Request, res: Response, next: NextFunction) {
    res.send("NOT IMPLEMENTED: Book update POST");
  }
}

export default BookCopyController;

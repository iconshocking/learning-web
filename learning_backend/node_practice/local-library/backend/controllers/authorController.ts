import { NextFunction, Request, Response } from "express";

class AuthorController {
  static async authorList(req: Request, res: Response, next: NextFunction) {
    res.send("NOT IMPLEMENTED: Author list");
  }

  static async authorDetail(req: Request, res: Response, next: NextFunction) {
    res.send(`NOT IMPLEMENTED: Author detail: ${req.params.id}`);
  }

  static async authorCreate(req: Request, res: Response, next: NextFunction) {
    res.send("NOT IMPLEMENTED: Author create POST");
  }

  static async authorDelete(req: Request, res: Response, next: NextFunction) {
    res.send("NOT IMPLEMENTED: Author delete POST");
  }

  static async authorUpdate(req: Request, res: Response, next: NextFunction) {
    res.send("NOT IMPLEMENTED: Author update POST");
  }
}

export default AuthorController;

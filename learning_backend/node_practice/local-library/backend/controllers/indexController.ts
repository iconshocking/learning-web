import { NextFunction, Request, Response } from "express";
import AuthorCollection, { Author } from "../models/authorCollection";
import BookCollection, { Book } from "../models/bookCollection";

class IndexController {
  // Display list of all genres.
  static index(req: Request, res: Response, next: NextFunction) {
    res.send("NOT IMPLEMENTED: Site home page");
  }

  static async test(req: Request, res: Response, next: NextFunction) {
    let response;
    try {
      const author = new Author({
        name: "John Arbuckle",
        date_of_birth: new Date("1978-07-28"),
      });
      await AuthorCollection.addAuthor(author);
      const book = new Book({
        title: "Garfield at Large",
        author_name: author.document.name,
        summary: "Garfield's first book",
      });
      await BookCollection.addBook(author.document._id, book);
      await BookCollection.addBookCopy(book.document._id);
      const fetchBook = await BookCollection.fetchBook(book.document._id);
      response = JSON.stringify(fetchBook?.document, null, 2);
    } catch (e: unknown) {
      console.log(e);
    } finally {
      res.send(response ?? "No response by end - ERROR");
    }
  }
}

export default IndexController;

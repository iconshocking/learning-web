import express from "express";
import { ObjectId } from "mongodb";
import AuthorCollection from "../models/authorCollection";

const router = express.Router();

/* GET home page. */
router.get("/", async function (req, res) {
  let response: any = "ERROR";
  try {
    const authorResp = await AuthorCollection.addAuthor({
      name: "John Arbuckle",
      date_of_birth: new Date("1978-07-28"),
    });
    const authorId = authorResp.insertedId.toHexString();
    const bookId = new ObjectId();
    await AuthorCollection.addBook(authorId, {
      _id: bookId,
      title: "Garfield at Large",
      summary: "Garfield's first book",
    });
    await AuthorCollection.addBookCopy(authorId, bookId.toHexString());
    const all = await AuthorCollection.fetchAll();
    response = all.map((author) => {
      return {
        name: author.name,
        books: author.books?.map((book) => {
          return { title: book.title, copies: book.copies?.map((copy) => copy.status) };
        }),
      };
    });
  } catch {
    //
  } finally {
    res.send(response);
  }
});

export default router;

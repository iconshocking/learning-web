import express from "express";
import { ObjectId } from "mongodb";
import AuthorCollection from "../models/authorCollection";
import BookCollection from "../models/bookCollection";
import mongo from "../app/mongo";
import debug from "debug";

const router = express.Router();

/* GET home page. */
router.get("/", async function (req, res) {
  let response: any = "ERROR";
  try {
    const authorName = "John Arbuckle";
    const authorResp = await AuthorCollection.addAuthor({
      _id: new ObjectId(),
      name: authorName,
      date_of_birth: new Date("1978-07-28"),
    });
    const authorId = authorResp.insertedId;
    const bookId = new ObjectId();
    await BookCollection.addBook(authorId, {
      _id: bookId,
      title: "Garfield at Large",
      author_name: authorName,
      summary: "Garfield's first book",
    });
    await BookCollection.addBookCopy(bookId);
    const book = await BookCollection.fetchBook(bookId);
    response = JSON.stringify(book, null, 2);
  } catch (e: any) {
    console.log(e)
  } finally {
    res.send(response);
  }
});

export default router;

import { Collection, ObjectId } from "mongodb";
import mongo from "../app/mongo";
import { debug as rootDebug } from "../app/server";
import AuthorCollection from "./authorCollection";

const BookCopySchema = {
  bsonType: "object",
  required: ["status"],
  properties: {
    _id: {
      bsonType: "objectId",
      description: "objectId is required",
    },
    status: {
      bsonType: "string",
      enum: ["available", "maintenance", "loaned", "reserved"],
      description: "must be a one of allowed values",
    },
    due_back: {
      bsonType: "date",
      description: "must be a date",
    },
  },
};

type BookCopy = {
  _id: ObjectId;
  status: "available" | "maintenance" | "loaned" | "reserved";
  due_back?: Date;
};

const BookSchema = {
  bsonType: "object",
  required: ["title", "author_name"],
  properties: {
    _id: {
      bsonType: "objectId",
      description: "objectId is required",
    },
    title: {
      bsonType: "string",
      description: "must be a string and is required",
    },
    // duplicated for ease of querying and unlikely to change
    author_name: {
      bsonType: "string",
      description: "must be a string and is required",
    },
    summary: {
      bsonType: "string",
      description: "must be a string",
    },
    genre: {
      bsonType: "array",
      items: {
        bsonType: "string",
      },
      description: "must be an array of genre strings",
    },
    copies: {
      bsonType: "array",
      items: BookCopySchema,
      description: "must be an array of book copies",
    },
  },
};

export type Book = {
  _id: ObjectId;
  title: string;
  author_name: string;
  summary?: string;
  genre?: string[];
  copies?: BookCopy[];
};

const debug = rootDebug("books");

class BookCollection {
  static async init() {
    const db = mongo.getDb();
    // create/update collection with validation schema and indices
    try {
      const exists = await db.listCollections({ name: "books" }).hasNext();
      if (!exists) {
        await db.createCollection("books", {
          validator: {
            $jsonSchema: BookSchema,
          },
        });
      } else {
        await db.command({
          collMod: "books",
          validator: {
            $jsonSchema: BookSchema,
          },
        });
      }
      debug(!exists ? "Created collection" : "Adjusted collection validation schema");
      // pre-existing indices are skipped and not recreated
      await BookCollection.collection().createIndexes([
        { key: { _id: 1 } },
        { key: { genre: 1 } },
        // only one text index is allowed per collection, so searching one specific field must
        // either be filtered out after the query or queried without using '$text/$search' operators
        { key: { title: "text", author_name: "text" } },
        { key: { "copies._id": 1 } },
        { key: { "copies.status": 1 } },
      ]);
    } catch (error) {
      mongo.logMongoError(error);
      throw error;
    }
  }

  static collection(): Collection<Book> {
    return mongo.getDb().collection("books");
  }

  static addBook(authorId: ObjectId, book: Book) {
    if (!book.summary) {
      delete book.summary;
    }
    if (!book.genre) {
      delete book.genre;
    }
    // only create copies after initial book creation to keep the API simple
    delete book.copies;

    return this.collection()
      .insertOne(book)
      .then(() => {
        return AuthorCollection._addBookTitle(authorId, book.title);
      })
      .catch((error) => {
        mongo.logMongoError(error);
        throw error;
      });
  }

  static addBookCopy(bookId: ObjectId) {
    return this.collection()
      .updateOne(
        { _id: bookId },
        {
          $push: {
            copies: { _id: new ObjectId(), status: "maintenance" },
          },
        }
      )
      .catch((error) => {
        mongo.logMongoError(error);
        throw error;
      });
  }

  static fetchAll() {
    return this.collection()
      .find()
      .toArray()
      .catch((error) => {
        mongo.logMongoError(error);
        throw error;
      });
  }

  static fetchBook(bookId: ObjectId): Promise<Book | null> {
    return this.collection()
      .find({ _id: bookId })
      .next()
      .catch((error) => {
        mongo.logMongoError(error);
        throw error;
      });
  }
}

BookCollection.init();

export default BookCollection;

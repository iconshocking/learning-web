import { Collection, ObjectId } from "mongodb";
import mongo from "../app/mongo";
import { debug as rootDebug } from "../app/server";

const BookCopySchema = {
  bsonType: "object",
  required: ["status"],
  properties: {
    _id: {
      bsonType: "objectId",
      description: "must be an objectid",
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
  required: ["title"],
  properties: {
    _id: {
      bsonType: "objectId",
      description: "must be an objectid",
    },
    title: {
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

type Book = {
  _id: ObjectId;
  title: string;
  summary?: string;
  genre?: string[];
  copies?: BookCopy[];
};

const AuthorSchema = {
  bsonType: "object",
  required: ["name", "date_of_birth"],
  properties: {
    name: {
      bsonType: "string",
      description: "must be a string and is required",
    },
    date_of_birth: {
      bsonType: "date",
      description: "must be a date and is required",
    },
    date_of_death: {
      bsonType: "date",
      description: "must be a date",
    },
    books: {
      bsonType: ["array"],
      items: BookSchema,
      description: "must be an array of book objects",
    },
  },
};

type Author = {
  name: string;
  date_of_birth: Date;
  date_of_death?: Date;
  books?: Book[];
};

const debug = rootDebug("authors");

// All books are nested underneath author since this locally collates all books by an author (and
// copies), which is the most common use case. Other use cases are searching for books by genre,
// title, genre, which is just as easily done using the same collection via indexing on those
// fields.
class AuthorWithBooksCollection {
  static async init() {
    const db = mongo.getDb();
    // create/update collection with validation schema
    try {
      const exists = await db.listCollections({ name: "authors" }).hasNext();
      if (!exists) {
        await db.createCollection("authors", {
          validator: {
            $jsonSchema: AuthorSchema,
          },
        });
      } else {
        await db.command({
          collMod: "authors",
          validator: {
            $jsonSchema: AuthorSchema,
          },
        });
      }
      debug(!exists ? "Created collection" : "Adjusted collection validation schema");
    } catch (error) {
      mongo.logMongoError(error);
      throw error;
    }
  }

  static collection(): Collection<Author> {
    return mongo.getDb().collection("authors");
  }

  static addAuthor(author: Author) {
    if (!author.date_of_death) {
      delete author.date_of_death;
    }
    delete author.books;

    return this.collection()
      .insertOne(author)
      .catch((error) => {
        mongo.logMongoError(error);
        throw error;
      });
  }

  static addBook(authorId: string, book: Book) {
    if (!book.summary) {
      delete book.summary;
    }
    if (!book.genre) {
      delete book.genre;
    }
    // only create copies after initial book creation to keep the API simple
    delete book.copies;

    return this.collection()
      .updateOne(
        { _id: new ObjectId(authorId) },
        {
          $push: {
            books: book,
          },
        }
      )
      .catch((error) => {
        mongo.logMongoError(error);
        throw error;
      });
  }

  static addBookCopy(authorId: string, bookId: string) {
    return this.collection()
      .updateOne(
        { _id: new ObjectId(authorId), "books._id": new ObjectId(bookId) },
        {
          $push: {
            // $ indicates this is matching against an array field
            "books.$.copies": { _id: new ObjectId(), status: "maintenance" },
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
}

AuthorWithBooksCollection.init();

export default AuthorWithBooksCollection;

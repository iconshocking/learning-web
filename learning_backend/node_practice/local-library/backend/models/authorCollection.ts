import { Collection, ObjectId } from "mongodb";
import mongo from "../app/mongo";
import { debug as rootDebug } from "../app/server";
import { Optional } from  "utility-types"

const AuthorSchema = {
  bsonType: "object",
  required: ["_id", "name", "date_of_birth"],
  properties: {
    _id: {
      bsonType: "objectId",
      description: "objectId is required",
    },
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
    // duplicated for ease of querying and unlikely to change
    book_titles: {
      bsonType: "array",
      items: {
        bsonType: "string",
      },
      description: "must be an array of strings",
    },
  },
};

type AuthorMongo = {
  _id: ObjectId;
  name: string;
  date_of_birth: Date;
  date_of_death?: Date;
  book_titles?: string[];
};

export class Author {
  document: AuthorMongo;

  constructor(base: Optional<AuthorMongo, "_id">) {
    this.document = { ...base, _id: base?._id ?? new ObjectId() };
  }
}

const debug = rootDebug("authors");

class AuthorCollection {
  static async init() {
    const db = mongo.getDb();
    // create/update collection with validation schema and indices
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
      // pre-existing indices are skipped and not recreated
      await AuthorCollection.collection().createIndexes([
        { key: { _id: 1 } },
        { key: { name: "text" } },
      ]);
    } catch (error) {
      mongo.logMongoError(error);
      throw error;
    }
  }

  static collection(): Collection<AuthorMongo> {
    return mongo.getDb().collection("authors");
  }

  static addAuthor(author: Author) {
    const document = author.document;
    if (!document.date_of_death) {
      delete document.date_of_death;
    }
    delete document.book_titles;

    return this.collection()
      .insertOne(document)
      .then((res) => {
        if (res.acknowledged) {
          return author;
        }
        throw new Error("Failed to insert author");
      })
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

  static _addBookTitle(authorId: ObjectId, bookTitle: string) {
    return this.collection().updateOne(
      { _id: authorId },
      {
        $push: {
          book_titles: bookTitle,
        },
      }
    );
  }
}

AuthorCollection.init();

export default AuthorCollection;

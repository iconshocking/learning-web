import { MongoClient, ServerApiVersion } from "mongodb";
import { debug as rootDebug } from "./server";

const debug = rootDebug("node-mongo");

class MongoDB {
  private client: MongoClient;

  constructor() {
    // mongo automatically reconnects upon actions that fail due to a lost connection
    // (https://mongodb.github.io/node-mongodb-native/3.6/reference/unified-topology/), so there is
    // no need to preconnect or set reconnect options (though there are retry options that can be tweaked)
    this.client = new MongoClient(
      `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo:27017`,
      {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      }
    );
  }

  getDb() {
    return this.client.db(process.env.MONGO_INITDB_DATABASE);
  }

  logMongoError(err: unknown) {
    debug(JSON.stringify(err, null, 2));
  }
}

export default new MongoDB();

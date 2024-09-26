import { Db, MongoClient, ServerApiVersion } from "mongodb";

class MongoDB {
  private client: MongoClient;
  private db?: Db;

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
}

const mongo = new MongoDB();
export default mongo;

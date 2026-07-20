import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/test";

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
};

export const mongoClient = globalForMongo.mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient;
}

export function getMongoDb() {
  return mongoClient.db();
}

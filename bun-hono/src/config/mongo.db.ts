// config/mongo.ts
import { MongoClient, Db } from "mongodb";

const username = process.env.MONGO_INITDB_ROOT_USERNAME || "root";
const password = process.env.MONGO_INITDB_ROOT_PASSWORD || "secret";
const host = process.env.MONGO_HOST || "localhost";
const port = process.env.MONGO_PORT || 27017;

const uri = `mongodb://${username}:${password}@${host}:${port}`;
const client = new MongoClient(uri, { maxPoolSize: 20 });

let dbInstance: Db | null = null;

export async function connectMongo(): Promise<Db> {
  if (dbInstance) return dbInstance;
  await client.connect();
  console.log("✅ MongoDB connected (pooled)");
  dbInstance = client.db("myapp");
  return dbInstance;
}

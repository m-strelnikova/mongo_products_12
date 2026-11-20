import { MongoClient } from "mongodb";
import "dotenv/config";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

const client = new MongoClient(uri);

let db;

export async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
  }
  return db;
}

export function getDB() {
  if (!db) {
    throw new Error("Database not connected");
  }
  return db;
}
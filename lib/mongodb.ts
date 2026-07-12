import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGODB_DB || 'flamehouse';
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

export function getMongoClient() {
  if (!client) {
    client = new MongoClient(uri, options);
  }
  if (!clientPromise) {
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function getMongoDb() {
  const mongoClient = await getMongoClient();
  return mongoClient.db(dbName);
}

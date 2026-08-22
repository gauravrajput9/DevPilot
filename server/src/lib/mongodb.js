import { MongoClient } from "mongodb";
import "dotenv/config";


if (!process.env.MONGO_URI) {
    console.log("No uri from dotenv")
}

const client = new MongoClient(process.env.MONGO_URI);

export const db = client.db();

export default client;
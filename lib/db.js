import { MongoClient } from "mongodb";

export const connectToDatabase = async () => {
  const client = MongoClient.connect(process.env.DB_URI);

  return client;
};

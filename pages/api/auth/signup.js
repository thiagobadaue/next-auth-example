import { connectToDatabase } from "../../../lib/db";
import { hashPassword } from "../../../lib/auth";

const handler = async (req, res) => {
  if (req.method !== "POST") return;

  const data = req.body;

  const { email, password } = data;

  const dataIsInvalid =
    !email || !email.includes("@") || !password || password.trim().length < 7;

  if (dataIsInvalid) {
    res.status(422).json({
      message: "Invalid input - password must be at least 7 characters long.",
    });
    return;
  }

  const client = await connectToDatabase();

  const db = client.db();

  const existingUser = await db.collection("users").findOne({ email });

  if (existingUser) {
    res.status(422).json({ message: "User exists already!" });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(password);

  db.collection("users").insertOne({
    email,
    password: hashedPassword,
  });

  res.status(201).json({ message: "Created user!" });
  client.close();
};

export default handler;

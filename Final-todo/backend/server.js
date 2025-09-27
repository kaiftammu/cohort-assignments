// server.js
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
let db;

async function connectDB() {
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db("todoapp"); // database name
  console.log("✅ MongoDB connected");
}
connectDB();

// 👉 CREATE
app.post("/items", async (req, res) => {
  const { name } = req.body;
  const result = await db.collection("items").insertOne({ name, done: false });
  res.json(result);
});

// 👉 READ
app.get("/items", async (req, res) => {
  const items = await db.collection("items").find().toArray();
  res.json(items);
});

// 👉 UPDATE (mark as done / edit text)
app.put("/items/:id", async (req, res) => {
  const { id } = req.params;
  const { name, done } = req.body;
  const result = await db.collection("items").updateOne(
    { _id: new ObjectId(id) },
    { $set: { name, done } }
  );
  res.json(result);
});

// 👉 DELETE
app.delete("/items/:id", async (req, res) => {
  const { id } = req.params;
  const result = await db.collection("items").deleteOne({ _id: new ObjectId(id) });
  res.json(result);
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));

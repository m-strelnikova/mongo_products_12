import express from "express";
import { ObjectId } from "mongodb";
import "dotenv/config";
import { connectDB, getDB } from "./db/connect.js"

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/products", async (req, res) => {
  try {
    const db = getDB();
    const { name, price, description } = req.body;
    const result = await db.collection("products").insertOne({
      name,
      price,
      description
    });
    res.status(201).json({ _id: result.insertedId, name, price, description });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const db = getDB();
    const products = await db.collection("products").find().toArray();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const db = getDB();
    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const db = getDB();
    const { name, price, description } = req.body;
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, price, description } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const db = getDB();
    const result = await db
      .collection("products")
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
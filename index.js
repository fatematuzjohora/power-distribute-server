require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectID;
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fytgj0e.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const billingCollection = client
      .db("PowerDistribute")
      .collection("billingList");
    app.get("/billing-list", async (req, res) => {
      const query = {};
      const cursor = billingCollection.find(query);
      const billingList = await cursor.toArray();
      res.send(billingList);
    });

    app.post("/add-billing", async (req, res) => {
      const addBilling = req.body;
      const result = await billingCollection.insertOne(addBilling);
      res.send(result);
    });
    app.delete("/delete-billing/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await billingCollection.deleteOne(query);
      res.send(result);
    });
    app.get("/consumer/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const consumer = await billingCollection.findOne(query);
      res.send(consumer);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("welcome to power distribute server");
});
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

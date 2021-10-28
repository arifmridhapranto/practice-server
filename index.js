const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gfkri.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("node-website");
    const userCollection = database.collection("users");

    //get api
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    // Post Api
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      console.log("post is working1", req.body);
      console.log("added a new user", result);
      res.json(result);

      // update user
      app.get("/users/:id", async (req, res) => {
        const id = req.params.id;
        console.log("load user id is : ", id);
        res.send("user getting soon", id);
      });

      //Delete api

      app.delete("/users/:id", async (req, res) => {
        const id = req.params.id;

        const query = { _id: ObjectId(id) };
        console.log(query);
        const result = await userCollection.deleteOne(query);
        console.log("deleting user id is : ", result);
        res.json(result);
      });
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("loading your project from node js server.");
});
app.listen(port, () => {
  console.log("your project running on port", port);
});

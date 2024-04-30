const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


// Middleware
app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)


// var uri = "mongodb://<username>:<password>@ac-62j8ihz-shard-00-00.7lbrva6.mongodb.net:27017,ac-62j8ihz-shard-00-01.7lbrva6.mongodb.net:27017,ac-62j8ihz-shard-00-02.7lbrva6.mongodb.net:27017/?ssl=true&replicaSet=atlas-g1t94d-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-62j8ihz-shard-00-00.7lbrva6.mongodb.net:27017,ac-62j8ihz-shard-00-01.7lbrva6.mongodb.net:27017,ac-62j8ihz-shard-00-02.7lbrva6.mongodb.net:27017/?ssl=true&replicaSet=atlas-g1t94d-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const artCraftCollection = client.db('ArtCraftDB').collection('art-craft');
    const subcategoryCollection = client.db('ArtCraftDB').collection('subcategory');

    // Get All Data
    app.get('/getsCraft', async(req, res) => {
      const cursor = artCraftCollection.find();
      const result = await cursor.toArray();

      res.send(result);
    })

    // Get Particular data by id
    app.get('/getsCraft/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await artCraftCollection.findOne(query);

      res.send(result);
    })


    // Get Craft By Email Address
    app.get('/myCraft/:email', async(req, res) => {
      const emailId = req.params.email;
      const query = {email: emailId};
      const result = await artCraftCollection.find(query).toArray();
      res.send(result);
    })

    // Add Single Craft 
    app.post('/addCraft', async(req, res) => {
      const newCraft = req.body;
      const result = await artCraftCollection.insertOne(newCraft);
      res.send(result);
    })

    // Delete Data Using ID
    app.delete('/delete/:id', async(req, res) => {
       const id = req.params.id;
       const query = {_id: new ObjectId(id)};
       const result = await artCraftCollection.deleteOne(query);
       res.send(result);
    })

    // Update Single Craft
    app.put('/updateCraft/:id', async(req, res) => {
      const UpdatedId = req.params.id;
      const bodyData = req.body;
      const update = { $set: bodyData };
      const query = { _id: new ObjectId(UpdatedId) };
      const result = await artCraftCollection.updateOne(query, update);
      res.send(result);
    })
    
    


    // SubCategory Data
    app.post('/addCategory', async(req, res) => {
      const newCategory = req.body;
      const result = await subcategoryCollection.insertOne(newCategory);
      res.send(result);
    })


    // Get All Subcategory
    app.get('/category', async(req, res) => {
       const cursor = subcategoryCollection.find();
       const result = await cursor.toArray();

       res.send(result);
    })


    // Get Only Category Wise Data
    app.get('/categoryDetails/:category', async(req, res) => {
      const subCategory = req.params.category;
      const query = {subcategoryName: subCategory};
      const result = await artCraftCollection.find(query).toArray();
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send(`Art & Craft Server is running`)
})

app.listen(port, () => {
    console.log(`Server Listen on port ${port}`)
})
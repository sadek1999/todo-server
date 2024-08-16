const express = require('express')
const cors=require('cors')
require('dotenv').config()
const app = express()
const port =process.env.port || 3000

app.use(cors())
app.use(express.json())
// rtodo-serve
// NHZp0oDPrc9Pd7TI

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.BDURL;

// const uri=
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const run = async () => {
    // await client.connect();
    try {
      const db = client.db('todo');
      const taskCollection = db.collection('tasks');
  
      // app.get('/tasks', async (req, res) => {
      //   const cursor = taskCollection.find({});
      //   const tasks = await cursor.toArray();
      //   res.send({ status: true, data: tasks });
      // });
  
      app.get('/tasks', async (req, res) => {
        let query = {};
        if (req.query.priority) {
          query.priority = req.query.priority;
        }
        const cursor = taskCollection.find(query);
        const tasks = await cursor.toArray();
        res.send({ status: true, data: tasks });
      });
  
      app.post('/task', async (req, res) => {
        const task = req.body;
       
        const result = await taskCollection.insertOne(task);
        res.send(result);
      });
  
      app.get('/task/:id', async (req, res) => {
        const id = req.params.id;
        const result = await taskCollection.findOne({ _id: ObjectId(id) });
        // console.log(result);
        res.send(result);
      });
  
      app.delete('/task/:id', async (req, res) => {
        const id = req.params.id;
        const result = await taskCollection.deleteOne({ _id: ObjectId(id) });
        // console.log(result);
        res.send(result);
      });
  
      // status update
      app.put('/task/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const task = req.body;
        const filter = { _id: ObjectId(id) };
        const updateDoc = {
          $set: {
            isCompleted: task.isCompleted,
            title: task.title,
            description: task.description,
            priority: task.priority,
          },
        };
        const options = { upsert: true };
        const result = await taskCollection.updateOne(filter, updateDoc, options);
        res.json(result);
      });
    } finally {
    }
  };
  
  run().catch((err) => console.log(err));
  

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();

//     const database=client.db('Todo').collection('todos')
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.exa7jan.mongodb.net/?retryWrites=true&w=majority`;

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
        const userCollection = client.db('jobDB').collection('users')
        const taskColluction = client.db('jobDB').collection("alltask");
        // post
        app.post('/users', async (req, res) => {
            const newPost = req.body
            console.log(newPost)
            const result = await userCollection.insertOne(newPost)
            res.send(result)
        })
        app.post('/alltask', async (req, res) => {
            const task = req.body;
            const result = await taskColluction.insertOne(task)
            res.send(result)
        })

        app.get('/alltask', async (req, res) => {
            const email = req.query?.email
            const result = await taskColluction.find({ email: email }).toArray()
            res.send(result)
        })

        app.put('/alltask/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const status = req.body.status;
            const updatedDoc = {
                $set: {
                    status: status
                }
            }
            const result = await taskColluction.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        app.delete('/alltask/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await taskColluction.deleteOne(filter)
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('my server is running')
})
app.listen(port, () => {
    console.log(`my server is running on port${port}`)
})
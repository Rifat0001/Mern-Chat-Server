const express = require("express");
const app = express();
const { chats } = require("./backend/data/data")
const dotenv = require("dotenv");
const connectDB = require("./backend/config/db");
dotenv.config();
const PORT = process.env.PORT || 5000;

//? for mongodb 

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rsztvpo.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);



//? for server requests 
app.get('/', (req, res) => {
    res.send('chat server is running');
})

app.get('/api/chat', (req, res) => {
    res.send(chats)
})

//? for single chat id 
app.get("/api/chat/:id", (req, res) => {
    //? id data will get in console.log(req.params.id)
    const singleChat = chats.find((c) => c._id === req.params.id);
    res.send(singleChat)
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
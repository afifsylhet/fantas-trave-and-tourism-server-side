const express = require('express');
require('dotenv').config()
const { MongoClient } = require('mongodb');

const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());


const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello, I am from node.js serverside')
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a3ykp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("fantasy_travel");
        const serviceCollection = database.collection("services");

        app.get('/services', async (req, res) => {
            const query = serviceCollection.find({});
            const cursor = await query.toArray();
            res.send(cursor);
        })





    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log("Listening form Port:", port)
});
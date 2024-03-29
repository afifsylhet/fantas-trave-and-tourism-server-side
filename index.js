const express = require('express');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;



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
        const serviceCollectionNew = database.collection("selectedServices");

        app.get('/services', async (req, res) => {
            const query = serviceCollection.find({});
            const cursor = await query.toArray();
            res.send(cursor);
        })

        app.post('/services', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            console.log("got new user", req.body);
            console.log("added user", result);
            res.json(result);
        });

        app.get('/services/myOrder', async (req, res) => {
            const query = serviceCollectionNew.find({});
            const cursor = await query.toArray();
            res.send(cursor);
        })




        app.patch('/services/myOrder', async (req, res) => {
            const newUser = req.body;
            if (!newUser.quantity) {
                newUser.quantity = 1;
            } else {
                newUser.quantity = parseInt(newUser.quantity) + 1;
            }
            const result = await serviceCollectionNew.insertOne(newUser);
            console.log("got new user", req.body);
            console.log("added user", result);
            res.json(result);
        });





        app.delete('/services/myOrder', async (req, res) => {
            const id = req.body._id;
            console.log(id);
            const query = { _id: id };
            const result = await serviceCollectionNew.deleteOne(query);
            res.json(result)
            console.log(result)
        })

        app.put('/services/myOrder', async (req, res) => {
            const id = req.body._id;
            console.log(id);
            const query = { _id: id };
            const options = { upsert: true };

            const updateDoc = {
                $set:
                {
                    status: "Approved"
                }

            };

            const result = await serviceCollectionNew.updateOne(query, updateDoc);
            // console.log("got new user", req.body);
            console.log("package approved", result);
            res.json(result);
        });




    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log("Listening form Port:", port)
});
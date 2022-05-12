const express = require('express');
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const {listen} = require('express/lib/application')
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5dfou.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const bicycleCollection = client.db('bicycle').collection('service');

        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = bicycleCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
            console.log(items);

        })
        // details
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await bicycleCollection.findOne(query);
            res.send(product);


        });

        // post item

        app.post('/products', async(req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await bicycleCollection.insertOne(newProduct);
            res.send(result);
        })

        //delete
        app.delete('/products/:id', async(req , res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await bicycleCollection.deleteOne(query);
            res.send(result);


        })


    }
    finally {

    }
};

run().catch(console.dir);

app.get('/', (req, res) => {

    res.send('running assignment')

})
app.listen(port, () => {
    console.log('site is rauning on port');
})
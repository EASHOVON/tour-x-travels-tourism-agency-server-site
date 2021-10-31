const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();


const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');


const port = process.env.PORT || 5000;


// MiddleWare
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@cluster0.w4gi1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run()
{
    try
    {
        await client.connect();
        const database = client.db('tourXTravels');
        const packageCollection = database.collection('packages');
        const orderCollection = database.collection('order');


        // POST API
        app.post('/packages', async (req, res) =>
        {
            const newService = req.body;
            const result = await packageCollection.insertOne(newService);
            res.json(result)
        })




        // --------------------------------------------------------------------

        // GET Products API
        app.get('/packages', async (req, res) =>
        {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages)
        })


        // Order post api
        app.post('/orders', async (req, res) =>
        {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result)
        })


        // Order get api
        app.get("/orders/:email", async (req, res) =>
        {
            const email = req.params.email;
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            const userOrder = orders.filter((mail) => mail.email === email);
            res.send(userOrder);
        });

        // Get All Order
        app.get('/allorders', async (req, res) =>
        {
            const cursor = orderCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })


        // Delete Specific Tour API
        app.delete("/orders/:id", async (req, res) =>
        {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const order = await orderCollection.deleteOne(query);
            res.json(order);
        });

    }
    finally
    {
        // await client.close();
    }
}

run().catch(console.dir)





app.get('/', (req, res) =>
{
    res.send('Tour-x-Travel-Tourism-Server is running');
});

app.listen(port, () =>
{
    console.log('Server running at port', port);
})
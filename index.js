const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()

const cors = require('cors');
const app = express();
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


        // GET Products API
        app.get('/packages', async (req, res) =>
        {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages)
        })
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
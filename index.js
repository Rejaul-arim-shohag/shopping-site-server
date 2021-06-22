const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config()

const port = process.env.PORT || 5000
console.log(process.env.DB_USER)

app.use(cors())
app.use(bodyParser.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fmftb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('client connection', err)
  const productCollection = client.db("shoppingSite").collection("products");
    
  app.get('/products', (req, res) =>{
      productCollection.find()
      .toArray((err, items)=>{
          res.send(items)
      })
  })

  app.get('/product/:id', (req, res)=>{
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((error, documents)=>{
        res.send(documents);
    })
})

   app.post('/addProduct', (req, res)=>{
       console.log(req.body)
       const newProduct =req.body;
       productCollection.insertOne(newProduct)
    //    console.log('adding new Product', newProduct)
    .then((result)=>{
        console.log(result)
        console.log('inserted count',result.insertedCount)
        res.send(result.insertedCount>0)
    })
   })

   app.get('/orders', (req, res)=>{
    productCollection.find({email: req.query.email})
    .toArray((err, totalOrder)=>{
      res.send( totalOrder)
    })
  })


//    app.get('/products', (req,res)=>{
//        console.log(req.query.email)
//     productCollection.find({})
//     toArray((err, documents) =>{
//         res.send(documents)
//     })
// })

});




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)
const express = require('express')
const app = express()
const port = 5000
require('dotenv').config()
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectId } = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://clean:${process.env.DB_PASS}@cluster0.wzz77.mongodb.net/service?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  // collection list
  const serviceCollection = client.db("service").collection("list");
  const clientReview = client.db("review").collection("list");
  const adminCollections = client.db("adminPanel").collection("emailList");
  const pricingCollections = client.db("pricing").collection("plans");
  const pricingPlanCollections = client.db("plan").collection("list");

  // add all service in db
  app.post('/addService', (req, res) => {
    serviceCollection.insertOne(req.body)
    .then(result => {
      res.status(200).send(result.insertedCount > 0)
    })
  })

  // get all service
  app.get('/allService', (req, res) => {
    serviceCollection.find({})
    .toArray((err, docs) => {
      if (!err && docs) {
        res.status(200).send(docs)
      } else {
        res.status(404).send(err)
      }      
    })
  })

  // load single service
  app.get('/singleService/:id', (req, res) => {
    serviceCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, docs) => {
      res.status(200).send(docs[0])
    })
  })

  // edit service
  app.patch('/editService/:id', (req, res) => {
    serviceCollection.updateOne({_id: ObjectId(req.params.id)}, {
      $set : {
        name: req.body.name,
        description: req.body.description,
        img: req.body.img
      }
    })
    .then(result => {
      res.send(result.modifiedCount > 0)
    })
  })

  // delete service
  app.delete('/deleteService/:id', (req, res) => {
    serviceCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })

  // add client review
  app.post('/addReview', (req, res) => {
    clientReview.insertOne(req.body)
    .then((result) => {
      res.status(200).send(result.insertedCount > 0)
    })
  })

  // get client all reviews
  app.get('/getReview', (req, res) => {
    clientReview.find({})
    .toArray((err, docs) => {
      if (!err) {
        res.status(200).send(docs)
      } else { res.status(404).send(err) }
    })
  })

  // get review by user email
  app.get('/getSingleReview/:email', (req, res) => {
    clientReview.find({email: req.params.email})
    .toArray((err, docs) => {
      if (!err) {
        res.status(200).send(docs[0])
      } else { res.status(404).send(err) }
    })
  })

  // get all pricing plans
  app.get('/allPricingPlans', (req, res) => {
    pricingCollections.find({})
    .toArray((err, docs) => {
      if (!err) {
        res.status(200).send(docs)
      }
    })
  })


  // get single pricing plan
  app.get('/singlePricingPlan/:id', (req, res) => {
    pricingCollections.find({_id: ObjectId(req.params.id)})
    .toArray((err, docs) => {
      if (!err) {
        res.status(200).send(docs[0])
      } else { res.status(404).send(err) }
    })
  })


  // make admin
  app.post('/makeAdmin', (req, res) => {
    adminCollections.insertOne(req.body)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })


  // get all admin email addresses
  app.get('/getAllAdmin', (req, res) => {
    adminCollections.find({})
    .toArray((err, docs) => {
      res.status(200).send(docs)
    })
  })


  app.delete('/deleteAdmin/:id', (req, res) => {
    adminCollections.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })

  app.post('/addPricingPlan', (req, res) => {
    pricingPlanCollections.insertOne(req.body)
    .then((result) => {
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/getPlan/:email', (req, res) => {
    pricingPlanCollections.find({email: req.params.email})
    .toArray((err, docs) => {
      if (!err) {
        res.status(200).send(docs[0])
      }
    })
  })

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

});


app.listen(process.env.PORT || port)
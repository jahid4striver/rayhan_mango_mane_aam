require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://kabirrayhan94:RCrkFOJpTl73vVU7@cluster0.khoup.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const bootstrap = async () => {
  try {
    const db = client.db('Mangomaneaam_Database');
    const userCollection = db.collection('users');
    const bookCollection = db.collection('books');
    const wishlistCollection = db.collection('wishlist');
    const orderCollection = db.collection('orders');
    const sliderImageCollection = db.collection('sliderimages');
    const getDiscountCollection = db.collection('discounts');
    const businessInfoCollection = db.collection('business_info');
    const websiteSettingsCollection = db.collection('website_setting');


    app.get('/users', async (req, res) => {
      const cursor = userCollection.find({});
      const book = await cursor.sort({ $natural: -1 }).toArray();
      res.send({ status: true, data: book });
    });

    app.post('/user', async (req, res) => {
      const book = req.body;
      const result = await userCollection.insertOne(book);
      res.send(result);
    });

    app.get('/user/:id', async (req, res) => {
      const id = req.params.id;
      const result = await userCollection.findOne({ _id: ObjectId(id) });
      res.send(result);
    });
    app.get('/user', async (req, res) => {
      const email = req.query.email;
      const result = await userCollection.findOne({ email });
      res.send(result);
    });

    app.put('/user/:id', async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updateDoc = {
        $set: user
      }
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id;
      const result = await userCollection.deleteOne({ _id: ObjectId(id) });
      console.log(result);
      res.send(result);
    });

    app.get('/getbookswithsearch', async (req, res) => {
      const search = req.query.search;
      let queryObject = {};
      if (search) {
        queryObject = {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } },
          ],
        };
      }
      const total = await bookCollection.find(queryObject).toArray();
      res.send(total)
    });

    app.get('/books', async (req, res) => {
      const cursor = bookCollection.find({});
      const book = await cursor.sort({ $natural: -1 }).toArray();
      res.send({ status: true, data: book });
    });

    app.post('/book', async (req, res) => {
      const book = req.body;
      const result = await bookCollection.insertOne(book);
      res.send(result);
    });

    app.get('/book/:id', async (req, res) => {
      const id = req.params.id;
      const result = await bookCollection.findOne({ _id: ObjectId(id) });
      console.log(result);
      res.send(result);
    });

    app.put('/book/:id', async (req, res) => {
      const id = req.params.id;
      const book = req.body;
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updateDoc = {
        $set: book
      }
      const result = await bookCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.get('/getbookswithfilter', async (req, res) => {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const skip = limit === "All" ? 0 : (page - 1) * limit;
      const search = req.query.search;
      let queryObject = {};
      if (search) {
        queryObject = {
          $or: [
            { name: { $regex: search, $options: 'i' } },
          ],
        };
      }
      const total = await bookCollection.find(queryObject).sort({ $natural: -1 }).skip(skip).limit(limit).toArray();
      const document = await bookCollection.countDocuments();
      const count = await bookCollection.find().toArray();
      const myLength = (count.length + 1).toString().padStart(5, '0')
      res.send({ total, document, myLength })
    });

    app.delete('/book/:id', async (req, res) => {
      const id = req.params.id;
      const result = await bookCollection.deleteOne({ _id: ObjectId(id) });
      console.log(result);
      res.send(result);
    });

    app.post('/wishlist', async (req, res) => {
      const wishlist = req.body;
      const result = await wishlistCollection.insertOne(wishlist);
      res.send(result);
    });

    app.get('/wishlists', async (req, res) => {
      const cursor = wishlistCollection.find({});
      const wishlist = await cursor.sort({ $natural: -1 }).toArray();
      res.send({ status: true, data: wishlist });
    });

    app.get('/wishlist/:id', async (req, res) => {
      const id = req.params.id;
      const result = await wishlistCollection.findOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.put('/wishlist/:id', async (req, res) => {
      const id = req.params.id;
      const wishlist = req.body;
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updateDoc = {
        $set: wishlist
      }
      const result = await wishlistCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.delete('/wishlist/:id', async (req, res) => {
      const id = req.params.id;
      const result = await wishlistCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });


    app.post('/order', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    app.get('/orders', async (req, res) => {
      const cursor = orderCollection.find({});
      const order = await cursor.sort({ $natural: -1 }).toArray();
      res.send({ status: true, data: order });
    });


    app.get('/getorderswithfilter', async (req, res) => {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const skip = limit === "All" ? 0 : (page - 1) * limit;
      const search = req.query.search;
      let queryObject = {};
      if (search) {
        queryObject = {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
          ],
        };
      }
      const total = await orderCollection.find(queryObject).sort({ $natural: -1 }).skip(skip).limit(limit).toArray();
      const document = await orderCollection.countDocuments();
      const count = await orderCollection.find().toArray();
      const myLength = (count.length + 1).toString().padStart(5, '0')
      res.send({ total, document, myLength })
    });

    app.get('/order/:id', async (req, res) => {
      const id = req.params.id;
      const result = await orderCollection.findOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.put('/order/:id', async (req, res) => {
      const id = req.params.id;
      const order = req.body;
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updateDoc = {
        $set: order
      }
      const result = await orderCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.delete('/order/:id', async (req, res) => {
      const id = req.params.id;
      const result = await orderCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.post('/discount', async (req, res) => {
      const order = req.body;
      const result = await getDiscountCollection.insertOne(order);
      res.send(result);
    });

    app.get('/discounts', async (req, res) => {
      const cursor = getDiscountCollection.find({});
      const discount = await cursor.sort({ $natural: -1 }).toArray();
      res.send({ status: true, data: discount });
    });

    app.get('/discount/:id', async (req, res) => {
      const id = req.params.id;
      const result = await getDiscountCollection.findOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.put('/discount/:id', async (req, res) => {
      const id = req.params.id;
      const discount = req.body;
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updateDoc = {
        $set: discount
      }
      const result = await getDiscountCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.delete('/discount/:id', async (req, res) => {
      const id = req.params.id;
      const result = await getDiscountCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });


    app.post('/sliderimage', async (req, res) => {
      const order = req.body;
      const result = await sliderImageCollection.insertOne(order);
      res.send(result);
    });

    app.get('/sliderimages', async (req, res) => {
      const cursor = sliderImageCollection.find({});
      const sliderimages = await cursor.sort({ $natural: -1 }).toArray();
      res.send({ status: true, data: sliderimages });
    });

    app.get('/sliderimage/:id', async (req, res) => {
      const id = req.params.id;
      const result = await sliderImageCollection.findOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.put('/sliderimage/:id', async (req, res) => {
      const id = req.params.id;
      const sliderimages = req.body;
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updateDoc = {
        $set: sliderimages
      }
      const result = await sliderImageCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.delete('/sliderimage/:id', async (req, res) => {
      const id = req.params.id;
      const result = await sliderImageCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.post('/review/:id', async (req, res) => {
      const bookId = req.params.id;
      const review = req.body.review;
      const reviewdBy = req.body.reviewdBy;
      const result = await bookCollection.updateOne({ _id: ObjectId(bookId) }, { $push: { reviews: { review, reviewdBy } } }
      );
      res.send(result);
    });


    app.post('/business_info', async (req, res) => {
      const business_info = req.body;
      const result = await businessInfoCollection.insertOne(business_info);
      res.send(result);
    });

    app.get('/business_infos', async (req, res) => {
      const cursor = businessInfoCollection.find({});
      const business_info = await cursor.sort({ $natural: -1 }).toArray();
      res.send({ status: true, data: business_info });
    });

    app.put('/business_info/:id', async (req, res) => {
      const id = req.params.id;
      const business_info = req.body;
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updateDoc = {
        $set: business_info
      }
      const result = await businessInfoCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.post('/website_settings', async (req, res) => {
      const website_settings = req.body;
      const result = await websiteSettingsCollection.insertOne(website_settings);
      res.send(result);
    });

    app.get('/website_settings', async (req, res) => {
      const cursor = websiteSettingsCollection.find({});
      const website_settings = await cursor.sort({ $natural: -1 }).toArray();
      res.send({ status: true, data: website_settings });
    });

    app.put('/website_settings/:id', async (req, res) => {
      const id = req.params.id;
      const website_settings = req.body;
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updateDoc = {
        $set: website_settings
      }
      const result = await websiteSettingsCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });



  } finally {
  }
};

bootstrap().catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Server Is Running');
});

app.listen(port, () => {
  console.log(`Akabir Books app listening on port ${port}`);
});

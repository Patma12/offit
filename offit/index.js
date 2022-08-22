const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const Product = require('./models/activity');
const Farm = require('./models/user')
const categories = ['fruit', 'vegetable', 'dairy'];


mongoose.connect('mongodb://localhost:27017/offit', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

// FARM ROUTES

app.get('/users', async (req, res) => {
    const farms = await Farm.find({});
    res.render('users/index', { farms })
})
app.get('/users/new', (req, res) => {
    res.render('users/new')
})
app.get('/users/:id', async (req, res) => {
    const farm = await Farm.findById(req.params.id).populate('activitys');
    res.render('users/show', { farm })
})

app.delete('/users/:id', async (req, res) => {
    const farm = await Farm.findByIdAndDelete(req.params.id);

    res.redirect('/users');
})




app.post('/users', async (req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    res.redirect('/users')
})

app.get('/users/:id/activitys/new', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    res.render('activitys/new', { categories, farm })
})

app.post('/users/:id/activitys', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    const { name, price, category } = req.body;
    const product = new Product({ name, price, category });
    farm.activitys.push(product);
    product.farm = farm;
    await farm.save();
    await product.save();
    res.redirect(`/users/${id}`)
})



// PRODUCT ROUTES

app.get('/activitys', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const activitys = await Product.find({ category })
        res.render('activitys/index', { activitys, category })
    } else {
        const activitys = await Product.find({})
        res.render('activitys/index', { activitys, category: 'All' })
    }
})

app.get('/activitys/new', (req, res) => {
    res.render('activitys/new', { categories })
})

app.post('/activitys', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/activitys/${newProduct._id}`)
})

app.get('/activitys/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('farm', 'name');
    res.render('activitys/show', { product })
})

app.get('/activitys/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('activitys/edit', { product, categories })
})

app.put('/activitys/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/activitys/${product._id}`);
})

app.delete('/activitys/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/activitys');
})



app.listen(5000, () => {
    console.log("APP IS LISTENING ON PORT 5000!")
})




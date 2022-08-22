const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')


const Activity = require('./models/activity');
const User = require('./models/user');
const styles = ['Stretch', 'Indoorbike', 'Jogging', 'Meditate', 'Running', 'Skate', 'Soccer', 'Travel', 'Weight', 'Yoga'];

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




//User routes

app.get('/users', async (req, res) => {
    const users = await User.find({});
    res.render('users/index', { users })
  
})

app.get('/users/new', (req, res) => {
    res.render('users/new')
})

app.get('/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);  /*populate('activitys')*/
    res.render('users/show', { user })
    
})

app.delete('/users/:id', async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);

    res.redirect('/users');
})




app.post('/users', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.redirect('/users')
})

app.get('/users/:id/activitys/new', async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render('activitys/new', { styles, user})
    // res.send("id activitiiiii")
})

app.post('/users/:id/activitys', async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    const {title,  activityThumbnail, style, duration, date } = req.body;
    const activity = new Activity({ title,  activityThumbnail, style, duration, date });
    user.activitys.push(activity);
    activity.user = user;
    await user.save();
    await activity.save();
    res.redirect(`/users/${id}`)
})


//Activity
app.get('/', (req,res)=>{
    res.send("Home Page is runnnnnnn!  <a href='/activitys'>All activitys</a>" )
})

app.get('/activitys', async (req, res) => {
    // const { style } = req.query;
    const { style } = req.query;
    if (style) {
        const activitys = await Activity.find({ style })
        res.render('activitys/index', { activitys, style })
    } else {
        const activitys = await Activity.find({})
        res.render('activitys/index', { activitys, style: 'All' })
    }
})

app.get('/activitys/new', (req, res) => {
    res.render('activitys/new', { styles })
})





app.post('/activitys', async (req, res) => {
    const newActivity = new Activity(req.body);
    await newActivity.save();
    res.redirect(`/activitys/${newActivity._id}`)
    
})

app.get('/activitys/:id', async (req, res) => {
    const { id } = req.params;
    const activity = await Activity.findById(id)
    res.render('activitys/show', { activity })
})

app.get('/activitys/:id/edit', async (req, res) => {
    const { id } = req.params;
    const activity = await Activity.findById(id);
    res.render('activitys/edit', { activity, styles })
})

app.put('/activitys/:id', async (req, res) => {
    const { id } = req.params;
    const activity = await Activity.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/activitys/${activity._id}`);
})

app.delete('/activitys/:id', async (req, res) => {
    const { id } = req.params;
    const deletedActivity = await Activity.findByIdAndDelete(id);
    res.redirect('/activitys');
})



app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})



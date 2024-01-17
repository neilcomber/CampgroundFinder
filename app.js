const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const engine = require('ejs-mate');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>{
    console.log('connected to database')
})
.catch(err => {
    console.log('failiure in connecting to databse,', err)
});
 

const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res)=>{
    res.render('home')
})

app.get('/campgrounds', async (req, res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
})

app.get('/campgrounds/new', async (req, res) => {
    res.render('campgrounds/new')
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', {campground})
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const editedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${editedCampground._id}`)
})

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', {campground})
})

app.post('/campgrounds', async (req, res) => {
    
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})





app.listen(3000, ()=>{
    console.log('serving on port 3000')
})

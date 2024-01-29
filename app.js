const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require('./utils/ExpressError')
const session = require('express-session');
const flash = require('connect-flash');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>{
    console.log('connected to database')
})
.catch(err => {
    console.log('failiure in connecting to databse,', err)
});
 

const app = express()

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret', 
    resave: false, 
    saveUninitialized: true, 
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)


app.get('/', (req, res)=>{
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500} = err;
    if(!err.message) err.message = 'Something Went Wrong'
    res.status(statusCode).render('error', { err })
    
})



app.listen(3000, ()=>{
    console.log('serving on port 3000')
})

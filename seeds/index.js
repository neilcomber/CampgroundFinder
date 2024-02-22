const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedhelpers')


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>{
    console.log('connected to database')
})
.catch(err => {
    console.log('failiure in connecting to databse,', err)
});

const sample = (arr)=>  arr[Math.floor(Math.random() * (arr.length - 1))]


const seedDB = async ()=>{
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const priceRandom = Math.floor(Math.random() * 100)
        
        const camp = new Campground({
            author: '65bb6f4e71bf4e0b068397cd',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dqpr4hpfv/image/upload/v1708067036/YelpCamp/zsuj5ssjwrgapphz8upl.png',
                  filename: 'YelpCamp/zsuj5ssjwrgapphz8upl',
                },
                {
                  url: 'https://res.cloudinary.com/dqpr4hpfv/image/upload/v1708067039/YelpCamp/ziium46jvpabslsweukl.png',
                  filename: 'YelpCamp/ziium46jvpabslsweukl',
                }
              ],
            description: 'Here is a lovely camping ground full of fish & chips', 
            price: priceRandom
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
    console.log('not connected anymore')
})
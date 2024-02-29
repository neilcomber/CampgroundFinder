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
    for(let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const priceRandom = Math.floor(Math.random() * 100)
        
        const camp = new Campground({
            //Should be your user id:
            author: '65bb6f4e71bf4e0b068397cd',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dqpr4hpfv/image/upload/v1709030116/YelpCamp/qjvt8lt50aur7g0rdhzw.jpg',
                    filename: 'YelpCamp/qjvt8lt50aur7g0rdhzw',
                  },
              
              ],
            description: 'Here is a lovely camping ground with wonderful walks and nice scenery, and a good coffee stall', 
            price: priceRandom, 
            geometry: { 
                type: 'Point', 
                coordinates: [ 
                    cities[random1000].longitude, 
                    cities[random1000].latitude, 

                 ] 
            },
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
    console.log('not connected anymore')
})
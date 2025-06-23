const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL="mongodb://localhost:27017/wandelust";

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.error("Error connecting to MongoDB:", err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"684fbc6ce8c15a95179dc3c0"}));
    initData.data=initData.data.map((obj)=>({...obj,geometry:{type:"Point",coordinates:[77.10249020,28.70405920]}}));
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data");
}

initDB();
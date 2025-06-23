const Listing=require('../models/listing.js');
const ExpressError = require('../utils/ExpressError.js');
const cloudinary = require('cloudinary').v2;

module.exports.index=async (req,res)=>{
    const {category}=req.query;
    if(!category){
        const alllistings = await Listing.find({});
        return res.render("listings/index.ejs",{alllistings});
    }
    const alllistings = await Listing.find({category:category});
    return res.render("listings/index.ejs",{alllistings});
}

module.exports.newListingForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing) {
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing=async (req,res,next)=>{
    const apiKey =process.env.MAP_KEY;
    const query=req.body.Listing.location+","+req.body.Listing.country;
    const mapurl = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(query)}.json?key=${apiKey}`;

    const response = await fetch(mapurl);
    const data = await response.json();

    const { lat, lon } = data.results[0].position;
    console.log(`Coordinates of "${query}":`, lat, lon); 

    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.Listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    const geoData = {
        type: "Point",
        coordinates: [lon,lat] // [lon, lat]
    };
    newListing.geometry=geoData;
    let category=req.body.Listing.category;
    const categoryArray = Array.isArray(category) ? category : [category];
    newListing.category=categoryArray;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

module.exports.editListingForm=async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing=async (req,res)=>{
    let {id} = req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    let category=req.body.Listing.category;
    const updatedCategory = Array.isArray(category) ? category : [category];
    listing.category=updatedCategory;
    await listing.save();
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    if (deletedListing.image && deletedListing.image.filename) {
        try {
            await cloudinary.uploader.destroy(deletedListing.image.filename); // filename = public_id
            console.log(`Deleted from Cloudinary: ${deletedListing.image.filename}`);
        } catch (err) {
            throw new ExpressError(404,"Something went wrong");
        }
    }
    req.flash("success","Listing Deleted!");
    // console.log(deletedListing);
    res.redirect("/listings");
}
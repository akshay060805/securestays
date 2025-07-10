const express=require('express');
const router=express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner,validateListing } = require('../middleware.js');
const multer=require('multer');
const {storage}=require('../cloudConfig.js');
const upload=multer({storage});

const listingController=require('../controllers/listings.js');

// Index route
// Create route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(validateListing,isLoggedIn,upload.single('Listing[image]'),wrapAsync(listingController.createListing));
    // .post(upload.single('Listing[image]'),(req,res)=>{
    //     res.send(req.file);
    // })

// New route
router.get("/new",isLoggedIn,listingController.newListingForm);

//location suggestion
router.get('/suggestions/locations',isLoggedIn,wrapAsync(listingController.locationSuggestion));

// Show route
// Update route
// Delete route
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single('Listing[image]'),validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

// Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListingForm));


module.exports=router;
const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectedUrl } = require('../middleware.js');

const userController=require('../controllers/users.js');

router
    .route("/signup")
    .get(userController.signupForm)
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    .get(userController.loginForm)
    .post(saveRedirectedUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),wrapAsync(userController.login));

router.get("/logout",userController.logout);

module.exports=router;
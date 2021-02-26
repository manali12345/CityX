var express=require("express");
var router= express.Router();
var path = require("path")
var user  = require("../models/users");
var passport = require("passport");
var Zillow  = require('node-zillow')
var inspect  = require('eyes').inspector({maxLength: 50000})


var zillow = new Zillow('your_zillow_ID')

router.get("/register",function(req,res){
    res.render("register");
})

router.get("/rss",function(req,res){
    res.render("rss");
})

router.post("/register",function(req,res){
    // res.send("Post working!");
    var newUser=({username:req.body.username});
user.register(newUser,req.body.password,function(err,user){
 if(err){
     console.log(err);
     res.render("register");
 }else{
     passport.authenticate("local")(req,res,function(){
         res.redirect("/");
     })
 }    
})
})

router.get("/login",function(req,res){
    res.render("login");
})

router.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login"}),function(req,res){
});

router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


router.get("/api",function(req,res){
    res.sendFile("F:/KJSCE College/SEM 8/Advanced Internet Technologies/Lab/Project/CityX/views/zillow.html");
});


router.get("/zillow",function(req,res){
    
    var parameters = {
        zpid: req.query.zpid
      };
    
    zillow.get('GetZestimate', parameters)
    .then(function(results) {
    inspect(results)
    res.setHeader('Content-Type','application/json');
    res.end(JSON.stringify({'result':results}));
    
    return results;

    // results here is an object { message: {}, request: {}, response: {}} 
  })
   
    
})





module.exports=router;
var express  = require("express");
var router   = express.Router({mergeParams:true});  //mergeParams is important to write when u cut short the route in app.use
var mongoose = require("mongoose");
var contact  = require("../models/contact");
var Sight    = require("../models/sights");
var middleware = require("../middleware/index");
router.post("",middleware.isLoggedIn,function(req,res){
// console.log("req.params.id="+req.params.id);
  Sight.findById(req.params.id,function(err,found){
       if(err){
           console.log(err);
              }else{
                //   console.log("Found="+found);
           contact.create(req.body.contact,function(err,foundContact){
               if(err){
                   console.log("There is an error in creating the contact");
                //   console.log(err);
                   res.redirect("/sights/"+req.params.id);
               }else{
                   console.log("Contact="+foundContact+" created!");
                  foundContact.user.username=req.user.username;
                  foundContact.user.id      =req.user._id;
                  foundContact.save();
                  found.contacts.push(foundContact);
                  found.save();
                  res.redirect("/sights/"+req.params.id);
               }
           })
       }
   })
});

module.exports=router;

//All middleware goes here
var Sight = require("../models/sights");
var comments= require("../models/comment");
var middlewareObj={};

middlewareObj.checkUser=function(req,res,next){ //This middleware is useful for sight
    console.log(req.params)
    Sight.findById(req.params.id,function(err,found){
       if(err){
           console.log(err);
       }else{
           if(!req.user._id.equals(found.author.id)){   //we cannot use == or === inthis place as one of them is a string and other one is the object so we need to use this method known as .equals()
               //console.log(found)
                console.log("Sorry but you dont have the permission to do that!");
               res.redirect("back"); //go to the back site
           }else{
           console.log("Next ke pehle!");
           return next();
           } 
       }
    });
}

//comment
middlewareObj.checkCommentUser=function(req,res,next){ 
    console.log()
    comments.findById(req.params.comment_id,function(err,found){
        // console.log(found.author.id)
       if(err){
           console.log(err);
       }else{
           if(!req.user._id.equals(found.author.id)){   //we cannot use == or === inthis place as one of them is a string and other one is the object so we need to use this method known as .equals()
               //console.log(found)
                console.log("Sorry but you dont have the permission to do that!");
               res.redirect("back"); //go to the back site
           }else{
           console.log("Next ke pehle!");
           return next();
           } 
       }

    

    });
}



middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();  //return next() is very important if you wont write it , it would keep on buffering over there only
    }else{
        console.log("Next ke baad!");
    res.redirect("/login");
    }
    
}

module.exports=middlewareObj;
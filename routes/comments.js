var express= require("express");
var router = express.Router({mergeParams:true}); //This is only when we cut short the routes sizes and we access the :id we are not able to access it so by writing this we can use or access the :id as wel in req.params.id
var Sight  =require("../models/sights");
var comment=require("../models/comment");
var middleware =require("../middleware/index");
//Comments new
router.get("/new",middleware.isLoggedIn,function(req,res){

    Sight.findById(req.params.id,function(err,sight){
        if(err){
            console.log("There is an error in finding the sight!");
        }else{
            console.log("sight found!");
            res.render("comments/new",{sight:sight});
        }
    })
});


//Comments create

router.post("/",middleware.isLoggedIn,function(req,res){
    Sight.findById(req.params.id,function(err,found){
        if(err){
            console.log("Error in finding the sight!");
            res.redirect("/sights");
        }else{
            comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log("error in creating comment!");
                }else{
                    comment.author.id=req.user._id; //current user ka username find karne ke liye req.user._id
                    comment.author.username=req.user.username;
                    comment.save(); //Save comment important
                    found.comments.push(comment);
                    found.save();
                    res.redirect("/sights/"+req.params.id);
                    // console.log("Sight saved!");
                    // console.log("Id="+req.params.id);
                }
            })
        }
    })
})

//Edit
router.get("/:comment_id/edit",middleware.isLoggedIn,middleware.checkCommentUser,function(req,res){
    comment.findById(req.params.comment_id,function(err,found){
        if(err){
            console.log(err);
        }else{
            res.render("comments/edit",{comment:found,sight_id:req.params.id});
        }
    })
   
});

router.put("/:comment_id",middleware.isLoggedIn,middleware.checkCommentUser,function(req,res){
   comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,foundComment){  //Since we have made a reference to sights we dont need to make any changes in sights it will automatically be changed but if we added more comments in the sights then we need to push the comment
       if(err){
           console.log(err);
       }else{
        //   console.log("Changed comment="+foundComment);
                res.redirect("/sights/"+req.params.id);
       }
   })
});
//Delete

router.delete("/:comment_id",middleware.isLoggedIn,middleware.checkCommentUser,function(req,res){
    comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            console.log(err);
            res.redirect("/sights/"+req.params.id);
        }else{
            console.log(req.params.id)
            //deleting the comment from Sight comments array
            Sight.findById(req.params.id,function(error,found){
                if(error){
                    console.log("error in creating comment!");
                }else{
                    console.log(found.comments)
                    found.comments.pull(req.params.comment_id);
                    found.save();
                    console.log(found.comments)
                }
            })
            
            console.log("Comment Deleted");
            res.redirect("/sights/"+req.params.id);
        }
    })
})

//middleware in middleware directory


module.exports=router;
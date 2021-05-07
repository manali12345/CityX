var express   = require("express");
var router    = express.Router();  //using Routers to send the routing data out
var Sight     = require("../models/sights");
var comments  = require("../models/comment");
var middleware = require("../middleware/index");


//Show all the sights
router.get("/",function(req,res){
    //Get all locations from db and showcase them
    Sight.find({},function(err,allSights){
        if(err){
            console.log(err);
        }else{
            res.render("sights/index",{sights:allSights});
        }
    });
   
});



router.post("/",middleware.isLoggedIn,function(req,res){
    
    var name       = req.body.name;
    var image      = req.body.image;
    var description= req.body.description;
    var location   = req.body.location;
    var city       = req.body.city.toLowerCase(); //for searching
    var price      = req.body.price;
    var author     ={
        id: req.user._id,
        username:req.user.username
    };
    var newSight={name:name,image:image,description:description,author:author,location:location,city:city,price:price};
    Sight.create(newSight,function(err,found){
        if(err){
            console.log("Error in the post!");
        }else{
           //This is another way of doing the thing
           //  found.author.id=req.user._id;
           //  found.author.username=req.user.username;
           //  found.save();
            console.log("Posted!");
            res.redirect("/sights");
        }
    });
});


// Show new form
router.get("/new",middleware.isLoggedIn,function(req,res){
   res.render("sights/new");
});



//Show comments

router.get("/:id",function(req,res){
    Sight.findById(req.params.id).populate("comments").exec(function(err,foundsight){
       if(err){
        //   console.log("There is an error");
          console.log(err);
        //   next(err);
        //   throw error();
       }else{
        //   console.log("Comment in found Sight="+foundsight.comments);
           res.cookie("sight_id", req.params.id, {maxAge: 360000});
        //    res.cookie("name", "manali", {maxAge: 360000});
           res.render("sights/show",{sight:foundsight,currentUser:req.user});
       }
    })
});

// router.use(function(req,res,next){
//     res.send("here");
// });
// router.use(function (err, req, res, next) {
//     console.log("error caught")
//     res.status(500).send('Something broke!')
//   })



//EDIT
router.get("/:id/edit",[middleware.isLoggedIn,middleware.checkUser],function(req,res){
    
    var val=req.params.id;
            Sight.findById(val,function(err,found){
                if(err){
                    console.log(err)
                }else{
                    var data={
                        author:found.name,
                        image:found.image,
                        description:found.description,
                        id:found._id,
                        location:found.location,
                        city    :found.city,
                        price   :found.price
        
                    };
                    res.render("sights/edit",{data:data});
                }
    });
   
});

router.put("/:id",[middleware.isLoggedIn,middleware.checkUser],function(req,res){
    Sight.findByIdAndUpdate(req.params.id,req.body.sights,function(err,found){
        if(err){
            console.log("Error in the update")
            res.redirect("/sights");
        }else{
            // console.log("The body="+req.body.sights);
            // console.log("Edited="+found);
            res.redirect("/sights/"+req.params.id);
        }
    })
})




//PATCH

router.patch("/:id",function(req,res){

    Sight.update(

        {_id:req.params.id},

        {$set:req.body},

        function(err){

            if(!err){

                res.send("PATCH done");

            }

        }

    );

});




//DELETE

router.delete("/:id",[middleware.isLoggedIn,middleware.checkUser],function(req,res){
   
    Sight.findById(req.params.id,function(err,found){
        if(err){
            console.log("error in sight deleting");
            res.redirect("/sights/"+req.params.id);
        }else{
            //code for removing comments from comments collections too
            found.comments.forEach(function(comment){
                comments.findByIdAndRemove(comment._id,function(err){
                    if(err){
                        console.log(err)
                    }
                });
            });

        }
    });
    

    Sight.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log("Error in Deleting!");
            res.redirect("/sights/"+req.params.id);
                }else{

            res.redirect("/sights");
             }
    })
});

// router.use("/",function (req,res,next){
// 	res.status(404).send('Unable to find the requested resource!');
// });



//middleware in middleware directory

module.exports=router;
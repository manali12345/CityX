var mongoose = require("mongoose");
var Sight    = require("./models/sights");
var comment  = require("./models/comment");

    
function seedDB(){
    Sight.remove({},function(err){
    if(err){
        console.log("Error in removing!");
    }
    console.log("Removed the sights!");
    });

}

module.exports=seedDB;


var mongoose=require("mongoose");

var sightSchema=new mongoose.Schema({
   name       :String,
   image      :String,
   description:String,
   location   :String,
   city       :String,
   price      :String,
   author:{
      id:{
         type:mongoose.Schema.Types.ObjectId,  //This is actually done to take reference from the type of Id that needs to be made for the author can be actually viewed as datatype taken from users module
         ref:"users"
         },
           username:String
          },
   comments:[
   {
      type:mongoose.Schema.Types.ObjectId,
      ref:"comment"
   }] ,
   contacts:[
      {
      type:mongoose.Schema.Types.ObjectId,
      ref :"contact"
     }]
});

module.exports=mongoose.model("Sight",sightSchema);
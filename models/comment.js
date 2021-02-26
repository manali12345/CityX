var mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
var commentSchema = mongoose.Schema({
    text:String,
    author:{
                id:{
                      type:mongoose.Schema.Types.ObjectId,
                      ref : "users"  //Its name should be same with the users model name
                   },
                   username:String 
    }
});

module.exports=mongoose.model("comment",commentSchema);
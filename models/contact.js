var mongoose      = require("mongoose");
var contactSchema = new mongoose.Schema({
    name    :String,
    email   :String,
    number  :String,
    info    :String,
    user    :{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref :"users"
        },
        username:String
    }
});

module.exports=mongoose.model("contact",contactSchema);
// the conctactSchema given during the time of module.exports should not be in quotes which causes error
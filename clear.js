var Sight    = require("./models/sights");

module.exports = {

clearall : function(){
    Sight.remove({},function(err){
    if(err){
        console.log("Error in removing!");
    }
    console.log("Removed the sights!");
    });

}

};



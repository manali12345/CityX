const express = require('express');
const bodyParser = require('body-parser');
const port = 3002;
const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.get('/app2',function(req,res){
    res.send("Hello World From Server 2");
});

app.listen(port,function(){
    console.log("Server has Started!!"+port);
});
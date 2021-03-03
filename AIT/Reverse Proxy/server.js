const express = require('express');
var httpProxy = require('http-proxy')
const port = 3000;
const app = express();
var apiProxy = httpProxy.createProxyServer();
var serverOne = 'http://localhost:3001',
	serverTwo = 'http://localhost:3002';

app.all('/app1',function(req,res){
	console.log("Redirecting to Server 1"+serverOne);
    apiProxy.web(req,res,{target : serverOne});
});

app.all('/app2',function(req,res){
	console.log("Redirecting to Server 2"+serverTwo);
    apiProxy.web(req,res,{target : serverTwo});
});

app.listen(port,function(){
    console.log("Server has Started!!"+port);
});
var express     = require("express"),
    app         = express(),
    path        = require("path")
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    clear      = require("./clear"),
    passport    = require("passport"),
    Zillow      = require('node-zillow')
    cookieParser = require("cookie-parser"),
    localStrategy=require("passport-local"),
    passportLocalMongoose=require("passport-local-mongoose"),
    methodOverride  =require("method-override");  //This is to use the Put and Delete routes

const mongoconn = process.env.MONGODB_URI;
mongoose.connect(mongoconn,{ useNewUrlParser: true, useUnifiedTopology: true });
 
//models importing
var Sight       = require("./models/sights"),
    user        = require("./models/users"),
    contact     = require("./models/contact"),
    comment     = require("./models/comment"),
//Requiring routes
    sightsRoutes   = require("./routes/sights"),//External referenced routed data needs to be required and used ,i.e., app.use
    commentRoutes  = require("./routes/comments"),
    indexRoutes    = require("./routes/index"),
    contactRoutes  = require("./routes/contact");

app.use(require("express-session")({ //Its position needs to be here if the possition is bit changed error would be generated!
    secret:"Its a secret",
    resave: false,
    saveUninitialized: false
}));

//middleware
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method')); //for delete method
app.use(cookieParser());

//The position of the declaration should always be above wherever it is used in this case the currentUser is refereced in the routes directory hence the app.use should be declared first
app.use(function(req,res,next){
    res.locals.currentUser = req.user;  //Current user ka username find karne ke liye req.user
    //console.log(req.user)
    next();
})

app.use(indexRoutes);
//All the comments routes start with /sights so that we dont need to write /sights each and every time
app.use("/sights",sightsRoutes);
app.use("/sights/:id/comments",commentRoutes); 
app.use("/sights/:id/contact",contactRoutes);  


passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());



app.get("/",function(req,res){
    res.render("landing");
});



app.post("/jiberrish",function(req,res){
    var city = req.body["key"];
    Sight.find({ city: city},function(err,foundElement){
        if(err){
            console.log(err);
        }else{
            res.render("sights/index.ejs",{sights:foundElement});
            console.log(foundElement);
        }
    });
});

app.use(function (req,res,next){
    res.status(404).sendFile(path.join(__dirname, 'views/err.html'));
	// res.status(404).sendFile("F:/KJSCE College/SEM 8/Advanced Internet Technologies/Lab/Project/CityX/views/err.html");
    // next();
});

app.use(function (err, req, res, next) {
    console.log(err)
    res.status(500).send('Something broke!')
  })

// app.use("/sights/",function (req,res,next){
// 	res.status(404).send('Unable to find the requested resource!');
// });

const port = process.env.PORT || 9000;

app.listen(port,function(){
    console.log("Server has Started at port no. 9000!!");
    // clear.clearall();
});

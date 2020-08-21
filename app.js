const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
// const Comment = require("./models/comment");
// const User = require("./models/user");
var seedDB = require("./seeds");

seedDB();

mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost:27017/yelp_camp", {
	useNewUrlParser:true,
	useUnifiedTopology:true
})
.then(() => console.log("Connecte to DB"))
.catch(err => console.log(err.message));

app.use(bodyParser.urlencoded({extented:true}));
app.set("view engine","ejs");

// Campground.create({
// 	name: "cute",
// 	image: "https://images.unsplash.com/photo-1534278931827-8a259344abe7?ixlib=rb-1.2.1&w=1000&q=80",
// 	description: "cutecute!"
// }, function(err,campground){
// 	if(err) {
// 		console.log(err);
// 	}else {
// 		console.log("Newly created campground: ")
// 		console.log(campground);
// 	}
// });

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req,res){
	
	//get all campgrounds from db
	Campground.find({}, function(err,campgrounds){
		if(err) {
			console.log(err);
		}else {
			res.render("index", {campgrounds:campgrounds});	
		}
	});
});

app.post("/campgrounds", function(req,res){
	//get data from form, add to database
	let name = req.body.name;
	let image = req.body.image;
	let description = req.body.description;
	let newCampground = {name: name, image: image, description: description};
	
	Campground.create(newCampground,function(err,newCreated){
		if(err) {
			console.log(err);
		}else {
			//redirect back to campgrounds website
			res.redirect("/campgrounds");	
		}
	});
	
});

app.get("/campgrounds/new", function(req,res){
	res.render("new");	
	//res.redirect("/campgrounds");
});

app.get("/campgrounds/:id", function(req, res) {
	//find the campground with provided ID
	
	// the comments stored in campground is its id, so we need to populate its content,
	// in this way, the foundOne has both its name, image, description and comments
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundOne){
		if(err){
			console.log(err);
		} else {
			//render
			res.render("show", {campground:foundOne});	
		}
	});
});

app.listen(3000, function(){
	console.log('YelpCamp server starts!');
})
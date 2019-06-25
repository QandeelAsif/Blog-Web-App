log=console.log;

var express = require("express"),
    app     = express(),
    mongoose= require("mongoose"),
  bodyParser=require("body-parser"),
  sanitizer =require("express-sanitizer"),
  methodOverride=require("method-override");


//APP CONFIG
app.use(express.static("public"));   //to use static files
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
    //sanitizer will always come ater body parser
app.use(sanitizer());
mongoose.connect("mongodb://localhost:27017/blogApp",{useNewUrlParser:true});
app.use(methodOverride("_method"));

//MONGOOSE/MODEL CONFIG
var blogSchema= new mongoose.Schema({
    title:String,
    body: String,
    image:String,
    created: {type:Date, default:Date.now}
})
var Blog=mongoose.model("Blog",blogSchema);

//======================================================================================\\
                                 //RESTFULL ROUTES\\

app.get("/",function(req,res){
    res.redirect("/blogs");
})                        


//INDEX           
app.get("/blogs",function(req,res)
{  Blog.find({},function(err,retrievedBlogs){
        if(err)
         log(err)
        else
         res.render("index",{blogs:retrievedBlogs});
          });
});

//NEW
app.get("/blogs/new",function(req,res){
    res.render("new")
})

//CREATE
app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err)
        log(err);
        else
        res.redirect("/blogs");
    })
})

//SHOW
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,selectedBlog){
        if(err)
         res.redirect("/blogs");
        else
        res.render("show",{blog:selectedBlog});
    })
})


//RESTFUL ROUTE: EDIT --show the edit page
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        redirect("/blogs");
        else
        {res.render("edit",{blog:foundBlog})};
    })
})

//UPDATE
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err)
        res.redirect("/blogs")
        else
        {
            //displaying new data on the show route
            res.redirect("/blogs/"+req.params.id);
        }
    })
})

//DELETE
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
        res.redirect("/blogs");
        else
        res.redirect("/blogs")
    })
})

//LISTENER PORT
app.listen("3000",function(){
    log("Blog server started!!");
})
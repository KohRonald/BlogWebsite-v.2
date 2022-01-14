const express = require("express");
const ejs = require("ejs");
const app = express();
const _ = require("lodash");
const mongoose = require("mongoose");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://");

const postSchema = new mongoose.Schema({
    title: String,
    content: String
})

const Post = new mongoose.model("post", postSchema);

//text to render to main pages
const homeStartingContent = "Welcome to the Chinese Fail Gang blog site. Feel free to enter your thoughts and ideas down here. There is no delete button so whatever you post will be here forever! Hope you enjoy this CFG blog website #CFG4LYFE.";
const aboutContent = "We are just a bunch of peeps that failed chinese and thought to ourselves, 'Why not call ourself the Chinese Fail Gang?'. And there the Chinese Fail Gang (CFG) was born. We have no hierarchy in here, if you failed chinese you are one of us. But for real, we the true gangsta around here killing people ears with our outstanding broken chinese.";
const contactContent = "You don't contact us, we contact you. But if we do contact you. Just remember we are the CFG, we cannot use chinese, it's against our own capability to comprehend those hieroglyphics.";

//render home
app.get('/', function(req, res) {

    Post.find({}, function(err, storedPosts) {
        if (!err) {
            res.render("home", { homeContent: homeStartingContent, newPosts: storedPosts });
        }
    })
})

//render about
app.get('/about', function(req, res) {

    res.render("about", { aboutContent: aboutContent });
})

//render contact
app.get('/contact', function(req, res) {

    res.render("contact", { contactContent: contactContent });
})

//render compose
app.get('/compose', function(req, res) {

    res.render("compose");
})

//store title and content input by user
app.post("/compose", function(req, res) {

    async function run() {
        const title = _.capitalize(req.body.title);
        const content = req.body.postBody;

        // urlTitle: _.kebabCase(req.body.title),

        const post = new Post({
            title: title,
            content: content
        });

        await post.save(function(err) {
            if (!err) {
                res.redirect("/");
            }
        });

    }
    run();
})

//render post to individual page
app.get("/posts/:postId", function(req, res) {

    const requestedPostId = req.params.postId;

    Post.findOne({ _id: requestedPostId }, function(err, foundPost) {
        if (!err) {
            res.render("post", ({ postTitle: foundPost.title, postContent: foundPost.content }));
        }
    });
})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

//listen to Port
app.listen(port, function() {
    console.log("Server has started succesfully");
});
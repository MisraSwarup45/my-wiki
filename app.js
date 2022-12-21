//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

//All Articles

app.route("/articles")
    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {
        // console.log(req.body.title);
        // console.log(req.body.content);

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save((err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully added");
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Successfully Deleted");
            }
            else {
                res.send(err);
            }
        });
    })


//Specific Articles
app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }, (err, foundArticles) => {
            if (foundArticles) {
                res.send(foundArticles);
            }
            else {
                res.send("Not able to find any article with this name");
            }
        })
    })
    .put((req, res) => {
        Article.findOneAndUpdate({ title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            (err) => {
                if (!err) {
                    res.send("Successfully Updated");
                }
            });
    })
    .patch((req, res) => {
        Article.findOneAndUpdate(
            { title: req.params.articleTitle },
            { $set: req.body },
            (err) => {
                if (!err) {
                    res.send("Successfully Updated");
                }
                else {
                    res.send(err);
                }
            }
        );
    })
    .delete((req, res) => {
        Article.deleteOne({ title: req.params.articleTitle }, (err) => {
            if (!err) {
                res.send("Deleted Successfully");
            }
            else {
                res.send(err);
            }
        });
    });



app.listen(3000, () => {
    console.log("Server started at port 3000");
});
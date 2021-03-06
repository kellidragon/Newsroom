const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const multer = require("multer");

const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

const PORT = process.env.PORT || 3000

// Initialize Express
const app = express();

// Configure middleware
app.use(logger("dev"));

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://user:password1.mlab.com:51997/heroku_k44g601m";
mongoose.connect((MONGODB_URI), { useNewUrlParser: true });;

// mongodb://localhost/newsroom



// Routes
app.get("/scrape", function (req, res) {
  axios.get("https://news.google.com/").then(function (response) {


    let $ = cheerio.load(response.data);
    $("article h3").each(function (i, element) {
      let result = {};

      result.title = $(this)
        .children("a")
        .text();
      result.summary = $(this)
        .children()
        .text();
      console.log(result.summary)
      result.link = $(this)
        .children("a")
        .attr("href");


      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });

    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});


// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {

  db.Comment.create(req.body)
    .then(function (dbComment) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {

      res.json(err);
    });
});


// Route for saving/updating article to be saved
app.put("/saved/:id", function (req, res) {

  db.Article
    .findByIdAndUpdate({ _id: req.params.id }, { $set: { saved: true } })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Route for getting saved article
app.get("/saved", function (req, res) {

  db.Article
    .find({ saved: true })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});


// Route for deleting an article
app.delete("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .then(function (dbArticle) {
      dbArticle.remove(function (err) {
        res.json(err);
      })
    })
    .catch(function (err) {
      res.json(err);
    })
})


// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});


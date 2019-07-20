const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const multer = require("multer");

const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

const PORT = 3000;

// Initialize Express
const app = express();

// Configure middleware
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsroom";
mongoose.connect((MONGODB_URI), { useNewUrlParser: true });;

// Routes

app.get("/scrape", function(req, res) {
  axios.get("https://news.google.com/").then(function(response) {
    
    let $ = cheerio.load(response.data);
    $("article h3").each(function(i, element) {
      let result = {};

      result.title = $(this)
        .children("a")
        .text();
      result.summary = $(this)
//         .children("article")
// console.log(result.summary)
      result.link = $(this)
        .children("a")
        .attr("href");
  

      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          // console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
   
 
  //   $("div img").each(function(i, element) {
  //       let result = {};
  //       result.img = $(this)
  //       .children("img")


  //   db.Article.create(result)
  //   .then(function(dbArticle) {
  //     // View the added result in the console
  //     console.log(dbArticle);
  //   })
  //   .catch(function(err) {
  //     // If an error occurred, log it
  //     console.log(err);
  //   });
  // });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});


// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("comment")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Route for deleting an article
app.delete("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
  .then(function(dbArticle) {
    dbArticle.remove(function(err){
      res.json(err);
    })
  })
  .catch(function(err) {
    res.json(err);
  })
})


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});


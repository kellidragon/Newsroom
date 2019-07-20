const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({

  title: String,
  body: String

});

// This creates our model from the above schema
const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;

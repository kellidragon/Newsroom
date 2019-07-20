const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String
  },
  summary: {
    type: String
  },
  link: {
    type: String
  },
  saved: {
    type: Boolean,
    default: false
  },
  img: {
    data: Buffer, 
    contentType: String
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;

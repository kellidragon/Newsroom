const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
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

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NoteSchema = new Schema({

  title: String,
  body: String

});

// This creates our model from the above schema
const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;

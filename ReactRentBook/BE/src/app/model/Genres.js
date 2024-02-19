const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const genreSchema = new Schema({
  name: { type: String, maxLength: 60, required: true },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'book',
    },
  ],
});

const Genres = mongoose.model('genre', genreSchema);
module.exports = Genres;

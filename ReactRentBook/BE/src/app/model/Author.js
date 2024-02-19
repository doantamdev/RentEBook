const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const authorSchema = new Schema (
    {
        name: {type: String, maxLength: 60, required: true},
        books: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'book'
            }
        ]
    }
)

const Authors = mongoose.model('author', authorSchema);
module.exports = Authors;
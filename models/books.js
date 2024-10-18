const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/comic');


const bookSchema = mongoose.Schema({
    name: String,
    authorname: String ,
    year: Number,
    price : Number ,
    discount: Number,
    pages : Number ,
    condition : String,
    description: String,
})

module.exports = mongoose.model("books", bookSchema)
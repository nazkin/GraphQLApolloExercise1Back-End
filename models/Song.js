const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songSchema = new Schema({
    name: String,
    genre: String,
    artistId: String
});

module.exports = mongoose.model("Song", songSchema)
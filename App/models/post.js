const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/db');

const CommentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const PostSchema = mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
   author: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
     comments: [CommentSchema],
});

module.exports = mongoose.model('Post', PostSchema);

const Post = module.exports = mongoose.model('Post', PostSchema);

module.exports.addPost = function(newPost, callback) {
        newPost.save(callback);
};

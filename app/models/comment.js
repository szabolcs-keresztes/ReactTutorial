// app/models/comment.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	id: Number,
	author: String,
	text: String,
	likeCount: Number
});

module.exports = mongoose.model('Comment', CommentSchema);

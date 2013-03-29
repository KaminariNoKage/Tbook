var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	// Somehow worked
});

var postSchema = mongoose.Schema({
	owner: String,
	name: String,
	fb_id: String,
	message: String,
	picture: String,
	link: String
});

var tweetSchema = mongoose.Schema({})

var Post = mongoose.model('User', postSchema);
module.exports = Post;

/*
 * GET home page.
 */

var Post = require('../models/tbk_model.js');
var async = require('async');

var exthash = function exthash(stry){
	//Extracting a link from a string
	var fin = []
		, words = stry.replace("\r\n", " ").split(" ")
		, comp = "";

	for (var i=0; i<words.length; i++){
		var temp = words[i],
			addnext = true;

		//Making hashtag from dashed words
		if (temp.search("http") == -1){
			if (temp.search("-") != -1){
				temp = "#" + temp.replace("-", "");
			};
		};

		//Making hashtags from capital words
		if (temp.search("@") == -1){
			if (temp.search("#") == -1){
				if (temp.length > 1){
					if (temp.charAt(0) == temp.charAt(0).toUpperCase()){
						addnext = false;
						comp = comp + temp;
					}
					else{
						if (comp != ""){
							temp = "#" + comp;
						};
						addnext = true;
						comp = "";
					};

					if (comp.indexOf(".") != -1){
						if (comp != ""){
							temp = "#" + comp;
						};
						addnext = true;
						comp = "";
					};

					if (comp.indexOf(",") != -1){
						if (comp != ""){
							temp = "#" + comp;
						};
						addnext = true;
						comp = "";
					};

					if (comp.indexOf("!") != -1){
						if (comp != ""){
							temp = "#" + comp;
						};
						addnext = true;
						comp = "";
					};

					if (i == words.length - 1){
						if (comp != ""){
							temp = "#" + comp;
						};
						addnext = true;
						comp = "";
					};
				};
			};
		};


		if (addnext == true){
			fin.push(temp);
		};
	};
	
	var retstr = "";
	for (var i=0; i<fin.length; i++){
		retstr = retstr + " " + fin[i];
	};
	return retstr;

};

var sortString = function sortString(max, post){
	var strx = post.message.replace("\n", " ")
		, img = post.picture;

	if (strx != null){
		if (strx.length > max){
			strx = strx.substring(0, max);
			var flstop = strx.search("\n");
			if (flstop != -1){
				strx = strx.substring(0, flstop);
			}
		};
		
		return exthash(strx);
	}
	else{
		return "";
	};
};

var makeTweet = function makeTweet(postx){
	//RSS Feed for Tweets: name, date, 140 char message
	var maxlen = 140
		, name = "@" + postx.name.replace(' ', '')
		, messlen = maxlen - name.length - 1 //(-1) creates a space between
		, date = new Date().getTime();
	

	var mess = sortString(messlen, postx);
	
	newTweet = mess + " " + name;

	return newTweet;
};

exports.index = function(req, res){
	req.facebook.api('/me', function(err, user) {

		var makePost = function makePost(pdata, callback){
			if (pdata.story == null){
				Post.find({fb_id: pdata.id}).sort().exec(function(err, docs){
					var poc = docs[0]
						, nm = pdata.from.name
						, fid = pdata.id
						, mes = pdata.message
						, pic = pdata.picture;
					if (poc == null){
						var newpoc = new Post({owner: user.id, name: nm, fb_id: fid, message: mes, picture: pic});
						newpoc.save(function(err){
							callback(err, newpoc);
						});
					}
					else{
						callback(err, null);
					};
				});
			}
			else{
				callback(null, null);
			};
		};

		req.facebook.api('/me/home', function(err, data) {
			var ext = data.data;
			async.map(ext, makePost, function(err, results){
				if (err)
					return "Error in Async.Map";

				Post.find({owner: user.id}).sort().exec(function(err, docs){
					var tweetList = [];
					for (var i=0; i<docs.length; i++){
						if (docs[i].message != null){
							tweetList.push(makeTweet(docs[i]));
						};
					};
					res.send(tweetList);
				});
			});
		});
	});
};
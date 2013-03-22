
/*
 * GET home page.
 */

exports.index = function(req, res){
	req.facebook.api('/me/feed', function(err, data) {
		var feed = data;
		res.send(feed);
		//res.render('index', { title: 'Express' });
	});
};
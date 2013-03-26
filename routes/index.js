
/*
 * GET home page.
 */

exports.index = function(req, res){
	req.facebook.api('/me/home', function(err, data) {
		var ext = data.data;
		res.send(ext);
		//res.render('index', { title: 'Express' });
	});
};
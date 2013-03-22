
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , Facebook = require('facebook-node-sdk');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(Facebook.middleware({ appId: '367123806734507', secret: '7c554b7c5946417761d5cd68faf4be6d' }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/tbook');
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

function facebookGetUser() {
  return function(req, res, next) {
    req.facebook.getUser( function(err, user) {
      if (!user || err){
        res.redirect('/');
      } else {
        req.user = user;
        next();
      }
    });
  }
}

app.get('/', Facebook.loginRequired({ scope: ['read_stream', 'publish_stream']}), routes.index);
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

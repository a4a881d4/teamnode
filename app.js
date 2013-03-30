
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , partials = require('express-partials')
  , cons = require('consolidate')
  , MongoStore = require('connect-mongo')(express)
  , settings = require('./Settings')
  , listm = require('./libs/listm')
  , path = require('path')
  , httpProxy = require('http-proxy')
  , proxy = httpProxy.createServer(5984, '10.0.2.15');
  ;



var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.engine('jade',cons.jade);
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session( {
  	secret: settings.cookieSecret,
  	Store: new MongoStore( {
  		db: settings.db
  	}),
  }));
  app.use('/couch',proxy);
  app.use(partials());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


listm.list( __dirname + '/routes',function( err, m ) {
  if(err) {
    console.log(" get modules error");
  } else {
    app.get('/', m['dashboard']['index']);
    app.get('/install', m['install']['reset']);
    app.get('/:controller',function( req, res, next ) {
      var c = req.params['controller'];
      var a = 'index';
      if( m[c] && m[c][a] ) {
        var f = m[c][a];
        f( req, res, next );
      }
      else
        next();
    });
    app.post('/:controller/:action',function( req, res, next ) {
      var c = req.params['controller'];
      var a = 'post'+req.params['action'];
      if( m[c] && m[c][a] ) {
        var f = m[c][a];
        console.log('match post:'+c+'/'+a);
        f( req, res, next );
      }
      else {
        console.log('unmatch post:'+c+'/'+a);
        next();
      }
    });
    app.get('/:controller/:action',function( req, res, next ) {
      var c = req.params['controller'];
      var a = 'get'+req.params['action'];
      if( m[c] && m[c][a] ) {
        var f = m[c][a];
        console.log('match get:'+c+'/'+a);
        f( req, res, next );
      }
      else {
        console.log('unmatch get:'+c+'/'+a);
        next();
      }
    });
    
    http.createServer(app).listen(app.get('port'), function(){
      console.log("Express server listening on port " + app.get('port'));
    });
  }
});





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
  , path = require('path');

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
  	})
  }));
  app.use(partials());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


var modules={};
listm.list( __dirname + '/routes',function( err, m ) {
  if(err) {
    console.log(" get modules error");
  } else {
    modules = m;
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
      var a = req.params['action'];
      if( m[c] && m[c][a] ) {
        var f = m[c][a];
        f( req, res, next );
      }
      else {
        console.log('unmatch :'+c+'/'+a);
        next();
      }
    });
    http.createServer(app).listen(app.get('port'), function(){
      console.log("Express server listening on port " + app.get('port'));
    });
  }
});




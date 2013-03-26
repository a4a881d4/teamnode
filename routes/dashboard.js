
/*
 * GET home page.
 */
var g = require('../Settings')
  , User = require('../models/user')
  ;
  
exports.index = function(req, res){
  if( !req.session.user )
    res.redirect('guest');
  res.render(g.web('main/dashboard/index'), { 
  	title: 'Express', 
  	menulist:g.activeByTitle('Todo'),
  	layout:g.web('default'), 
  	user:req.session.user,
  	lang:g.lang 
  	});
};

exports.getabout = function(req,res) {
  res.render(g.ajax('dashboard/about',{layout:false}));
};

exports.getprofile = function(req,res) {
  res.render( g.ajax('dashboard/profile'), {
    user:req.session.user,
    lang:g.lang,
    layout:false
    });
};

exports.postupdate_profile = function(req,res) {
	var needs = ['mobile','tel','eid','weibo','desp','email'];
	for( k in needs ) {
		session.user[needs[k]] = req.body[needs[k]];
	}
	var newU = new User(session.user);
	newU.update( function( err, user ) {
	  if( err ) {
	    res.json({err_code:1,message:"unknow"});
	  } else {
	    res.json({err_code:0,data:JSON.stringify(user)});
	  }
	});
};		
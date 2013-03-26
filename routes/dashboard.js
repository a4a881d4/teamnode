
/*
 * GET home page.
 */
var g = require('../Settings');

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

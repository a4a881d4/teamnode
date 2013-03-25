
/*
 * GET home page.
 */
var g = require('../Settings');

exports.index = function(req, res){
  res.render(g.web('main/dashboard/index'), { 
  	title: 'Express', 
  	menulist:g.activeByTitle('Todo'),
  	layout:g.web('default') 
  	});
};



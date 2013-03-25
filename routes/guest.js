var g = require('../Settings');

exports.index = function(req, res){
  res.render(g.web('main/guest/index'), { 
  	title: 'Guest', 
  	layout:g.web('fullwidth') 
  	});
};

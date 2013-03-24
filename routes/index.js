
/*
 * GET home page.
 */

exports.index = function(req, res){
	menulist=[{href:'?c=dashboard',title:'Todo',img:'images/tt2.menu.todo.png'},
						{href:'?c=feed',title:'feed',img:'images/tt2.menu.feed.png'},
						{href:'?c=buddy',title:'buddy',img:'images/tt2.menu.buddy.png'}
					];
  res.render('index', { 
  	title: 'Express', 
  	menulist:menulist,
  	layout:'web' 
  	});
};

exports.guest = function(req, res){
  res.render('guest', { 
  	title: 'Guest', 
  	layout:'fullwidth' 
  	});
};
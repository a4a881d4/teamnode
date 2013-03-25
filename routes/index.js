
/*
 * GET home page.
 */

var	menulist=[	{href:'/dashboard',title:'Todo',img:'images/tt2.menu.todo.png'}
							,	{href:'/feed',title:'feed',img:'images/tt2.menu.feed.png'}
							,	{href:'/buddy',title:'buddy',img:'images/tt2.menu.buddy.png'}
							];

function activeByTitle( title ) {
	for(i=0;i<menulist.length;i++) {
		item = menulist[i];
		if( item.title == title )
			item.active=true;
		else
			item.active=false;
	}
	return menulist;
}

exports.index = function(req, res){
  res.render('dashboard', { 
  	title: 'Express', 
  	menulist:activeByTitle('Todo'),
  	layout:'default' 
  	});
};

exports.guest = function(req, res){
  res.render('guest', { 
  	title: 'Guest', 
  	layout:'fullwidth' 
  	});
};

exports.buddy = function(req, res){
  res.render('buddy', { 
  	title: 'buddy', 
  	menulist:activeByTitle('buddy'),
  	layout:'card' 
  	});
};
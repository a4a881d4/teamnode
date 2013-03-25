
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

function web( str ) {
	return 'layout/web/'+str;
}

exports.index = function(req, res){
  res.render(web('main/dashboard/index'), { 
  	title: 'Express', 
  	menulist:activeByTitle('Todo'),
  	layout:web('default') 
  	});
};

exports.guest = function(req, res){
  res.render(web('main/guest/index'), { 
  	title: 'Guest', 
  	layout:web('fullwidth') 
  	});
};

exports.buddy = function(req, res){
  res.render(web('main/buddy/index'), { 
  	title: 'buddy', 
  	menulist:activeByTitle('buddy'),
  	layout:web('card') 
  	});
};
var jade = require('jade')
  , path = require('path')
  , fs = require('fs')
  ;

var menulist=[ {href:'/dashboard',title:'Todo',img:'images/tt2.menu.todo.png'}
             , {href:'/feed',title:'feed',img:'images/tt2.menu.feed.png'}
             , {href:'/buddy',title:'buddy',img:'images/tt2.menu.buddy.png', level:9 }
             ];

var errorCode = {
    LR_API_TOKEN_ERROR:10001
  , LR_API_USER_ERROR:10002
  , LR_API_DB_ERROR:10004
  , LR_API_NOT_IMPLEMENT_YET:10005
  , LR_API_ARGS_ERROR:10006
  , LR_API_DB_EMPTY_RESULT:10007
  , LR_API_USER_CLOSED:10008
  , LR_API_FORBIDDEN:10009
  , LR_API_UPGRADE_ERROR:10010
  , LR_API_UPGRADE_ABORT:10011
};

var activeByTitle = function activeByTitle( title ) {
    for(i=0;i<menulist.length;i++) {
      item = menulist[i];
      if( item.title == title )
        item.active=true;
      else
        item.active=false;
    }
    return menulist;
  };

var web = function web( str ) {
    return 'layout/web/'+str;
  };
var is_email = function is_email( str ) {
    if( str )
      return true;
    else
      return false;
  };
var render = function render( str ) {
  var file = path.join(__dirname + '/views',str)+'.jade';
  var jadeFile = fs.readFileSync(file);
  var fn = jade.compile(jadeFile);
  return fn;
};

var jsforword = function jsforword( url ) {
  return '<script>location="' +url+ '"</script>';
};

module.exports = {
  cookieSecret: 'a4a881d4@163.com',
  db: 'teamnode',
  host: 'localhost',
  activeByTitle:activeByTitle,
  web:web,
  errorCode:errorCode,
  is_email:is_email,
  render:render,
  jsforword:jsforword
};
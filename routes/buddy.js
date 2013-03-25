var g = require('../Settings')
  , User = require('../models/user');

exports.index = function(req, res){
  res.render(g.web('main/buddy/index'), { 
  	title: 'buddy', 
  	menulist:g.activeByTitle('buddy'),
  	layout:g.web('card') 
  	});
};

exports.add = function(req,res) {
  var user={};
  user.name=req.body.name;
  user.name.replace(/ /g,'');
  user.email=req.body.email;
  user.password=req.body.password;
  var session={user:{}};
  session.user.level=9;
  User.sign_up(user,session,function(err,u) {
    if( err ) {
      console.log(JSON.stringify(err));
    } else {
      var fn = g.render('layout/ajax/widget/buddy');
      console.log(JSON.stringify(u));
      res.json({err_code:0, data:{html:fn({
          mylevel:9,
          buddy:u[0]
        })}
      });
    }
  });
};

exports.data = function(req,res) {
  User.get(function(err,u) {
    if( err ) {
      console.log(JSON.stringify(err));
    } else {
      var fn = g.render('layout/ajax/widget/buddy');
      console.log(JSON.stringify(u));
      var str='';
      for( k in u ) {
        str += fn({
          mylevel:9,
          buddy:u[k]
        });
      }
      res.send(str);
    }
  });
};

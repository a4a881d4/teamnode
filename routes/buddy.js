var g = require('../Settings')
  , User = require('../models/user');

exports.index = function(req, res){
  if( !req.session.user )
    res.redirect('guest');
  console.log(JSON.stringify(req.session.user));
  res.render(g.web('main/buddy/index'), { 
  	title: 'buddy', 
  	menulist:g.activeByTitle('buddy'),
  	layout:g.web('card'),
  	user:req.session.user,
  	lang:g.lang  
  	});
};

exports.postaddOne = function(req,res) {
  var user={};
  user.name=req.body.name;
  user.name.replace(/ /g,'');
  user.email=req.body.email;
  user.password=req.body.password;
  User.sign_up(user,req.session,function(err,u) {
    if( err ) {
      console.log(JSON.stringify(err));
      res.json({err_code:g.errorCode['LR_API_FORBIDDEN'],message:err});
    } else {
      var fn = g.render('layout/ajax/widget/buddy');
      console.log(JSON.stringify(u));
      res.json({err_code:0, data:{html:fn({
          mylevel:9,
          buddy:u
        })}
      });
    }
  });
};

exports.postdata = function(req,res) {
  User.get(function(err,u) {
    if( err ) {
      console.log(JSON.stringify(err));
    } else {
      var fn = g.render('layout/ajax/widget/buddy');
      var str='';
      for( k in u ) {
        str += fn({
          mylevel:req.session.user.level,
          buddy:u[k]
        });
      }
      res.send(str);
    }
  });
};

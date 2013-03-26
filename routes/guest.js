var g = require('../Settings')
  , User = require('../models/user')
  , crypto = require('crypto')
  ;
  
exports.index = function(req, res){
  res.render(g.web('main/guest/index'), { 
  	title: 'Guest', 
  	layout:g.web('fullwidth') 
  	});
};

exports.postlogin = function(req,res) {
  var email = req.body.email;
  var password = req.body.password;
  User.getByEmail(email,function( err, user ) {
    if(!user) {
      res.send("没有这个email");
    } else {
      var md5 = crypto.createHash('md5');
      password = md5.update(password).digest('base64');
      if( password == user.password ) {
        req.session.user = user;
        res.send("成功登入,转向中"+g.jsforword('/dashboard')); 
      } else {
        res.send("密码错误");
      }
    }
  });
};
 
exports.getlogout = function(req, res){
  if( req.session.user )
    req.session.user=null;
  res.redirect('/guest');
};
        

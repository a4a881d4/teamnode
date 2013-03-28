var settings = require('../Settings')
  , User = require('../models/user')
  , info = require('../libs/info')
  , crypto = require('crypto')
  ;
    
exports.reset = function(req, res){
  var md5 = crypto.createHash('md5');
  var passwd = md5.update(new Date().toString()).digest('base64').toString(); 
  md5 = crypto.createHash('md5'); 
  var admin = new User({
    email: 'a4a881d4@163.com',
    password: md5.update(passwd).digest('base64'),
    name:'admin',
    level:9
  });
  User.getByEmail(admin.email, function(err, user) {
    myinfo="";
    if(user) {
      User.delByEmail(admin.email, function(err, user) {
        admin.save( function(err,user) {
          if(err.err_code!=0) {
            myinfo ='error'+err.toString()+' '+err.password;
          } else {
            myinfo = 'replace password :'+passwd;
          }
          info.info_page(req,res,myinfo);
      });
      });
    } else {
      admin.save( function(err,user) {
        if(err.err_code!=0) {
          myinfo ='error'+err.toString()+' '+err.password;
        } else {
           myinfo = 'password :'+passwd;
        }
        info.info_page(req,res,myinfo);
      });
    }
  });
};


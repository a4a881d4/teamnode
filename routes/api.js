
var Vcounter = require('../libs/vcounter')
  ;
  
exports.index = function(req, res){
  res.json({err_code:0,data:{}});
};

exports.getim_counter = function(req,res) {
  var imc = new Vcounter('im_counter');
  imc.incr( function(err,v) {
    if(err) {
      res.json({err_code:1,message:err});
    } else {
      res.json({err_code:0,data:v});
    }
  });
};


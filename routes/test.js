exports.index = function(req, res){
  var user = {
    name:'abc',
    email:'abc@123',
    Uid:'abc',
    level:1
  };
  res.render('layout/ajax/widget/buddy', {
        mylevel:9,
        buddy:user
      });
};

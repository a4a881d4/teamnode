var fs = require('fs')
  , path = require('path')
  ;

exports.list = function list( dir, cb ) {
  fs.readdir( dir, function( err, files ) {
    if( err ) {
      cb( err, null );
    } else {
      var modules={};
      for( k in files ) {
        var file = files[k];
        if( path.extname(file) == '.js' ) {
          var name = path.basename(file,'.js');
          var loc = path.join(dir,file);
          modules[name]=require(loc);
        }
      }
      cb( null, modules );
    }
  });
};

        

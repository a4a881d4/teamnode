var mongodb = require('./db')
  , crypto = require('crypto')
  ;

function User(user) {
  this.email = user.email;
  this.password = user.password;
  this.name = user.name;
  if( user.Uid )
  	this.Uid = user.Uid;
  if( user.level )
  	this.level = user.level;
};
module.exports = User;

User.prototype.newUid = function newUid() {
	var md5 = crypto.createHash('md5');
	md5.update(new Date().toString());
	var uid = md5.update(this.email).digest('hex').toString();
	return uid;
};

User.prototype.toObj = function toObj() {
	var user = {
    email: this.email,
    password: this.password,
    name: this.name
  };
  
  if( this.Uid )
  	user.Uid = this.Uid;
  else
  	user.Uid = this.newUid();
  	
  if( this.level )
  	user.level = this.level;
  else
  	user.level = 1;	
  return user;
};

User.prototype.save = function save(callback) {
	var user = this.toObj();
	console.log("user :"+user.toString());
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.ensureIndex('Uid', {unique: true});
      collection.insert(user, {safe: true}, function(err, user) {
        mongodb.close();
        callback(err, user);
      });
    });
  });
};

User.getBy = function getBy( some, callback ) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.findOne(some, function(err, doc) {
        mongodb.close();
        if (doc) {
          var user = new User(doc);
          callback(err, user);
        } else {
          callback(err, null);
        }
      });
    });
  });
};

User.getByEmail = function getByEmail(email, callback) {
	User.getBy({email:email},callback);
};

User.delBy = function del(some, callback) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.remove(some, function(err, doc) {
        mongodb.close();
        callback(err, doc);
      });
    });
  });
};

User.delByEmail = function delByEmail(email, callback) {
	User.delBy({email:email},callback);
};

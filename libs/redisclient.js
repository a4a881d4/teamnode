var redis = require("redis")
  , g = require('../Settings')
  , client = redis.createClient(g.redis.port,g.redis.host);

module.exports = {
    client:client
};

client.on("error", function (err) {
    console.log("redis client error event - " + client.host + ":" + client.port + " - " + err);
});
client.auth(g.redis.auth,function(err) {
  console.log("auth :"+err);
});

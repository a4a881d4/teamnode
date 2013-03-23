
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('layout/web/default', { title: 'Express', TEAM_FEED:'my' });
};
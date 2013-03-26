var g = require('../Settings');

exports.info_page = function(req, res, info) {
	res.render('layout/web/info',{ title:'系统消息', info:info, layout:false, menulist:[], user:req.session.user, lang:g.lang });
}

exports.info_page = function(req, res, info) {
	res.render('info',{ tilte:'系统消息', info:info, layout:'web' });
}
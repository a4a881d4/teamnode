
exports.info_page = function(req, res, info) {
	res.render('info',{ title:'系统消息', info:info, layout:false, menulist:[] });
}
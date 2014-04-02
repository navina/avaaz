
/*
 * GET home page.
 

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
*/


exports.home = function(req, res){
  res.render('home')
};

exports.submitReport = function(req, res){
	res.render('submitReport')
};

exports.viewMap = function(req, res){
	res.render('viewMap')
}

exports.legalAdvise = function(req, res){
	res.render('legalAdvise')
}

exports.aboutUs = function(req, res){
	res.render('aboutUs')
}

exports.contactUs = function(req, res){
	res.render('contactUs')
}


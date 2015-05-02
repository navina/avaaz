
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

exports.submitReportData = function(req, res){
    var data = req.body;
    console.log(data);
    var db = require('./backend.js');
    var result = db.processForm(data, function(incidentId) {
        console.log("This is your report ID - " + incidentId);    
        res.send(200, {"id":incidentId});
    })
};


exports.viewReport = function(req,res){
    var db = require('./backend.js');
    console.log("inside view report");
    var id = req.query.id
    if(id){
        db.fetchDataFromId(id, function(result){
        console.log("This is your report result - " + result);    
        res.send(result);
    });    
    }else{
        db.fetchData(function(result){
        console.log("This is your report result - " + result);    
        res.send(result);
    });    
    }
    
}

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

exports.sampleMap = function(req, res){
	res.render('sampleMapWithAddress')
}

exports.info = function(req, res){
    res.render('info')    
}

exports.connect = function(req, res){
    res.render('connect')    
}

exports.track = function(req, res){
    res.render('track')    
}

exports.thankyou = function(req, res){
    res.render('thankyou')    
}

exports.api = function(req, res){
    res.render('api')
}

exports.org = function(req, res) {
    var data = req.body;
    console.log(data);
    var db = require('./backend.js');
    var result = db.addOrganization(data, function(orgId){
        console.log("Organization ID - " + orgId);    
        res.send(200, {"id": orgId});
    })    
}

exports.viewOrg = function(req,res){
    var data = {};
    data['orgType'] = req.query.orgType;
    data['state'] = req.query.state;
    data['city'] = req.query.city;
    console.log(data);
    var db = require('./backend.js');
    var result = db.fetchOrgData(data, function(orgData) {
        console.log("Organization Data - " + orgData);
        res.send(200, orgData);
    })    
}

var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');
var transporter = nodemailer.createTransport(ses({
    region: 'us-west-2'
}));

exports.submitFeedback = function(req, res){
    var data = req.body;
    console.log(data);
    var name = (data.name) ? data.name : 'Unspecified';
    var emailAddress = (data.email) ? data.email : 'Unspecified';
    var emailBody = '<h3>Name:</h3><p>' + name + '</p><br /><h3>Email:</h3><p>' + emailAddress + '</p><br /><h3>Feedback:</h3><p>' + data.message + '</p>';
    transporter.sendMail({
        from: 'arzavj93@gmail.com',
        to: 'zariya-feedback@googlegroups.com',
        subject: 'Feedback from ' + name,
        html: emailBody,
        generateTextFromHTML: true
    }, function(error, info){
        if (error) {
            res.send(500, "Error sending mail to SES. See heroku logs.");
            console.log(error);
        } else {
            res.send(200, "Feedback successfully submitted.");
            console.log('Message sent: ' + info.response);
        }
    });
};

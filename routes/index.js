
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
    var result = db.processForm(data, function(incidentId){
        console.log("This is your report ID - " + incidentId);    
        res.send(200, {"id":incidentId});
    })
};


exports.viewReport = function(req,res){

    var db = require('./backend.js');
    console.log("inside view report");
    db.fetchData(function(result){
        console.log("This is your report result - " + result);    
        res.send(result);
    });


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


exports.index = function(req, res){
    
    /*var mysql = require('mysql');
     
     
     
     var dbconfig = {
     
     host:'localhost',
     
     user:'chhaya',
     
     password:'chhayPass123',
     
     database:'chhaya',
     
     port:'3306'
     
     };
     
     var connection = mysql.createConnection(dbconfig);
     
     var query ='SELECT * FROM person';
     
     connection.query(query, function(err, rows, fields){
     
     if(err) throw err;
     
     //res.render('index', { title: 'Express', 'items':rows });
     
     else
     
     console.log(rows);
     
     
     
     });
     
     connection.destroy( );*/
    
    
    
    var Pool = require('mysql-simple-pool');
    var maxConnections = 100
    
    var pool = new Pool(maxConnections, {
                        
                        host: 'localhost',
                        
                        user: 'zariya',
                        
                        password: 'zariyaPass123',
                        
                        database: 'zariya'
                        
                        });
    
    var qry ='SELECT * FROM person';
    
    var qry1='INSERT INTO person(firstName,lastName,email,phone)VALUES("john","doe","j@doe.com","1234567788")';
    pool.query(qry1, function(err, results){
               
               if(err) throw err;
               
               
               })
    
    pool.query(qry, function(err, results){
               
               if(err) throw err;
               
               else
               
               console.log(results);
               
               });
    pool.dispose();
}


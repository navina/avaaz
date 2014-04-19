
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
    var doYouKnowAssailant = data.doYouKnow;
    console.log(data); // prints out entire json data
    console.log(doYouKnowAssailant); // prints out a single field
    res.send(200);
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
                        
                        user: 'chhaya',
                        
                        password: 'chhayPass123',
                        
                        database: 'chhaya'
                        
                        });
    
    var qry ='SELECT * FROM person';
    
    pool.query(qry, function(err, results){
               
               if(err) throw err;
               
               else
               
               console.log(results);
               
               });
    pool.dispose();
}


var mysql = require('mysql');
var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'zariya',
  password : 'zariyaPass123',
  database : 'zariya',
  port: '3306'
});

module.exports.fetchData = function(callback) {
	// Please fill in - we can't obviously fetch all records. Are we going to have a cap on it ??
	pool.getConnection(function(err, connection) {
		connection.query('SELECT latitude, longitude, categories FROM incident', function(err, result) {
			if(err)	throw err;
			else {
				//console.log(result.latitude);
				callback(result);
			}
			connection.release();
		});
	});
}

module.exports.processForm = function(data, callback) {
	var reporterRelation = processReporterRelation(data.person);  // !! make this mandatory? - Needs to be consistent with Backend Enum strings!
	var firstTime = data.firstTime; // !! make this mandatory ?
    var doYouKnowAssailant = data.doYouKnow; // !! make this mandatory or give an option like don't want to disclose
    var incidentList = returnEmptyOnUndefined(data.incidentList); // !! make this mandatory ; otherwise what is the point of this data collection
    var otherIncidence = data.otherIncidence; // !! make this non-empty if no option is chosen from the list above
    var location = returnEmptyOnUndefined(data.location);
    var locationLat = returnEmptyOnUndefined(data.locationLat);
    var locationLng = returnEmptyOnUndefined(data.locationLng);
    var incidentDate = returnCurrentDateOnUndefined(data.date);	// !! since it is defined as Not null, for now just put current time and date
    var incidentTime  = returnCurrentTimeOnUndefined(data.time);
    var comments = returnEmptyOnUndefined(data.comments);
    var firstName = returnEmptyOnUndefined(data.firstName);
    var lastName = returnEmptyOnUndefined(data.lastName);
    var email = returnEmptyOnUndefined(data.email);
    var phone = returnEmptyOnUndefined(data.number);

    if(incidentList.indexOf('Other') != -1) {
    	incidentList = otherIncidence;
    }

    if(firstTime == undefined)
    	firstTime = 'X';
    if(doYouKnowAssailant == undefined)
    	doYouKnowAssailant = 'X';
    // !! incidentId should be returned to user in either an alert box or a new page , so that they can use this as reference in the future phases of our project
    // For example, if we have to redirect them to some help center then the authorities will require an ID for this report.
    // For now, we can use this auto-generated ID. We can later use more encoding to represent an reportIDString
    createIncidentRecord(incidentList, incidentDate, incidentTime, location, locationLat, locationLng, comments, firstTime, doYouKnowAssailant, reporterRelation, function(incidentId){
    	console.log("Inside processForm - " + incidentId);
    //Creating reporter's data
    if(firstName != '' || lastName != '' || email != '' || phone != '') {
    	var personId = createPersonRecord(firstName, lastName, email, phone);
    	if(personId > 0) {
    		createRelationshipRecord(personId, incidentId);
    	}
    }
    callback(incidentId)
	
    });
    
}

function createRelationshipRecord(personId, incidentId) {
	var insertData = {
		personId: personId,
		incidentId: incidentId
	}
	pool.getConnection(function(err, connection) {
		connection.query('INSERT INTO relationship SET ?', insertData, function(err, result) {
			if(err)	throw err;
			connection.release();
		});
	});	
}

function createPersonRecord(firstName, lastName, email, phone) {
	var insertData = {
		firstName: firstName,
		lastName: lastName,
		email: email,
		phone: phone
	};
	pool.getConnection(function(err, connection) {
		connection.query('INSERT INTO person SET ?', insertData, function(err, result) {
			if(err)	throw err;
			var id = result.insertId;	// !! I am not sure how to return this to the UI. Once connection.release() is invoked, result is invalidated. So reference is undefined. Try to figure out how to copy the value and not reference here
			connection.release();
			return id;
		});
	});
}

function createIncidentRecord(incidentList, incidentDate, incidentTime, location, locationLat, locationLng, comments, firstTime, knownAssailant, reporterRelation, callback) {
	var insertData = { 
		categories: incidentList, 
		incidentDate: incidentDate,
		incidentTime: incidentTime,
		location: location,
		latitude: locationLat,
		longitude: locationLng,
		comment: comments,
		firstTime: firstTime,
		knownAssailant: knownAssailant,
		reporterRelation: reporterRelation
	};
	console.log(insertData);
	pool.getConnection(function(err, connection) {
		connection.query( 'INSERT INTO incident SET ?', insertData, function(err, result) {
			if(err) throw err;
			var id = result.insertId;
			connection.release();
			callback(id);
  		});
	});

}

function processReporterRelation(reporterRelation) {
	if(reporterRelation)
		return reporterRelation.toUpperCase();
	return '';
}

function returnEmptyOnUndefined(anyData) {
	if(anyData)
		return anyData;
	return '';
}

function returnCurrentDateOnUndefined(anyDate) {
	if(anyDate)
		return anyDate;
	return new Date();
}

function returnCurrentTimeOnUndefined(anyTime) {
	if(anyTime)
		return anyTime;
	var d = new Date();
	var SEPARATOR = ':';
	return d.getHours() + SEPARATOR + d.getMinutes() + SEPARATOR + d.getSeconds();
}


var mysql = require('mysql');
var validator = require('node-validator');
var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'zariya',
  password : 'zariyaPass123',
  database : 'zariya',
  port: '3306'
});

var mandatoryFieldError = function(fieldName) {
	throw new Error(fieldName + " is a mandatory field"); 
}

var invalidFieldValue = function(fieldName, itemSet, item) {
	throw new Error("Invalid value '" + item + "' for " + fieldName + "Allowed values - " + itemSet);
}

module.exports.fetchData = function(callback) {
	// Please fill in - we can't obviously fetch all records. Are we going to have a cap on it ??
	pool.getConnection(function(err, connection) {
		connection.query('SELECT latitude, longitude, categories FROM incident WHERE latitude != "" AND longitude != ""', function(err, result) {
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
	//Mandatory fields
	var reporterRelation = processReporterRelation(data.person);
    var doYouKnowAssailant;
    if(data.doYouKnow) {
    	if(validateYesOrNoField(data.doYouKnow)) {
    		doYouKnowAssailant = data.doYouKnow;
    	} else {
    		invalidFieldValue("doYouKnow", ['Y', 'N', 'Yes', 'No'], data.doYouKnow);
    	}
    } else {
    	mandatoryFieldError("doYouKnow");
    }

	var firstTime = 'X';
	if(reporterRelation == 'SURVIVOR') {
		if(data.firstTimeCrime) {
			if(validateYesOrNoField(data.firstTimeCrime)) {
				firstTime = data.firstTimeCrime.toUpperCase();
			} else {
				invalidFieldValue("firstTimeCrime", ['Y', 'N', 'Yes', 'No', 'X'], data.firstTimeCrime);
			}
		} else {
			//If the survivor reports, it is required to know whether the incident is the first time or not. 
			mandatoryFieldError("firstTimeCrime");
		}
	}

    var incidentList = returnEmptyOnUndefined(data.incidentList); // !! make this mandatory ; otherwise what is the point of this data collection
    var otherIncidence = data.otherIncidence; // !! make this non-empty if no option is chosen from the list above


    validate({
    	'incidentDate': data.incidentDate,
    	'incidentTime': data.incidentTime,
    	'location': data.location,
    	'locationLat': data.locationLat,
    	'locationLng': data.locationLng,
    	'email': data.email
    });
    var location = data.location;
    var locationLat = data.locationLat;
    var locationLng = data.locationLng;    
    var incidentDate = data.incidentDate;
    var incidentTime  = data.incidentTime;

    var comments = returnEmptyOnUndefined(data.comments);
    var firstName = returnEmptyOnUndefined(data.firstName);
    var lastName = returnEmptyOnUndefined(data.lastName);
    var phone = returnEmptyOnUndefined(data.number);
    var email = returnEmptyOnUndefined(data.email);

    if(incidentList.indexOf('Other') != -1) {
    	incidentList += "," + otherIncidence;
    }

    console.log("HERE -======== " + data);
    // !! incidentId should be returned to user in either an alert box or a new page , so that they can use this as reference in the future phases of our project
    // For example, if we have to redirect them to some help center then the authorities will require an ID for this report.
    // For now, we can use this auto-generated ID. We can later use more encoding to represent an reportIDString
    createIncidentRecord(incidentList, incidentDate, incidentTime, location, locationLat, locationLng, comments, firstTime, doYouKnowAssailant, reporterRelation, function(incidentId){
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

function validate(data) {
	var check = validator.isObject()
					.withRequired('incidentTime', validator.isString({regex: /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/}))
					.withRequired('incidentDate', validator.isIsoDate())
					.withRequired('location', validator.isString())
					.withRequired('locationLat', validator.isString())
					.withRequired('locationLng', validator.isString())
					.withOptional('email', validator.isString({regex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/}));

	validator.run(check, data, function(errorCount, errors) {
		if(errorCount > 0) {
			console.log(errors);
			throw new Error(errors);
		}
		//console.log(errors);
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

function validateYesOrNoField(fieldValue) {
		var allowedValues = ['Y', 'N', 'YES', 'NO'];
		if(allowedValues.indexOf(fieldValue.toUpperCase()) < 0) {
			return false;
		} else {
			return true;
		}
}

function processReporterRelation(reporterRelation) {
	if(reporterRelation) {
		var reporterRelationvalues = ['SURVIVOR','FRIEND_OF_SURVIVOR','RELATIVE_OF_SURVIVOR','NOT_RELATED'];
		if(reporterRelationvalues.indexOf(reporterRelation.toUpperCase()) < 0) {
			throw new Error("Invalid value for  person. Allowed values - " + reporterRelationvalues);
		} else {
			return reporterRelation.toUpperCase();			
		}
	}
	else {
		mandatoryFieldError("person");	
	}
}

function returnEmptyOnUndefined(anyData) {
	if(anyData)
		return anyData;
	return '';
}


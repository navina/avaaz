$(document).ready(function(){
	$("#first_time").hide();
	$("#other_div").hide();
	
	$("#date").datepicker();

	$( "#date" ).datepicker("option", "dateFormat", "yy-mm-dd" );


	$("#OTHER_INCIDENT").click(function() {
  		var isChecked = $(this).is(':checked');
  		if(isChecked)
    	{
       		$("#other_div").show();
    	}
    	else
    	{
        	$("#other_div").hide();
    	}

	});
	
});

var map;
									
function initialize() {
  var mapOptions = {
      zoom: 4,
	  center: new google.maps.LatLng(21.1458004, 79.0881546)
	   };
	map = new google.maps.Map(document.getElementById('map-canvas'),
				      mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);

function onClickButton(){

										if($("#location").val() == "")
										{
											alert("please enter value of location");
										}
										else
										{
											getGoogleMapApiEndpoint(document.getElementById('location').value);
											document.getElementById('map-canvas').style.display = 'block';
										}
									}

									function getGoogleMapApiEndpoint(address) {
									    var x = "https://maps.googleapis.com/maps/api/geocode/json?sensor=true&key=AIzaSyCSlmQ6fLKvbnU8u-H_Sg6qaRxEX_55nOg&address="+encodeURIComponent(address);
									    
									    $.ajax({url:x,success:function(result){
									      var cooridnateObject = result.results[0].geometry.location
									      var myLatlng = new google.maps.LatLng(cooridnateObject.lat,cooridnateObject.lng);
									      dropPin(cooridnateObject)
									    }});

									}

									function dropPin(cooridnateObject) {
									  var myLatlng = cooridnateObject;
									  var mapOptions = {
									    zoom: 12,
									    center: myLatlng
									  }
									  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

									  var marker = new google.maps.Marker({
									      position: myLatlng,
									      map: map,
									      title: 'Sample Pin'
									  });
									  document.getElementById("locationLat").value = myLatlng.lat;
									  document.getElementById("locationLng").value = myLatlng.lng;
									  console.log(document.getElementById("locationLat").value);
									  console.log(document.getElementById("locationLng").value);

									}


function first_time_display()
{
	var val = $('input[name=person]:checked').val();
	if(val == "SURVIVOR")
	{
		$("#first_time").show();
	}
  	else
  	{
  		$("#first_time").hide();
  	}
}

function onSubmitClick() //to check for empty fields
{
	flag = true;
	onSubmission();	
}

function onSubmission()
{
	var person = $('input[name=person]:checked').val(); //person who is reporting
	
	var doYouKnow = $('input[name=assailant]:checked').val(); //do you know assailant
	
	var firstTimeCrime;
	
	if(person == "Survivor")
	{
		firstTimeCrime = $('input[name=time]:checked').val(); //first time facing crime
	}
	else
	{
		firstTimeCrime = "Not Applicable"
	}
	
	
	var incident_list="";
	 $('.incident:checked').each(function() {
          incident_list += $(this).val() + ",";
        });
        incident_list =  incident_list.slice(0,-1);
    	//alert(incident_list);
    
    var otherIncidence="Not Applicable";
     
    if(incident_list.indexOf("Other")!=-1)
    	otherIncidence = $("#other").val();
 	
 	//alert(incident_description);
 	
	var location = $("#location").val();
	var locationLat = $("#locationLat").val();
	var locationLng = $("#locationLng").val();

	var date = $("#date").val();
	var time = $("#time").val();
	
 	var comments = $("textarea#additional_info").val();

 	var firstName = $("#firstName").val();
 	var lastName = $("#lastName").val();
 	var email = $("#email").val();
 	var number = $("#number").val();

 	if(firstName == "")
 		firstName = "Anonymous";
 	if(lastName == "")
 		lastName = "Anonymous";
 	if(email == "")
 		email = "Anonymous";
 	if(number == "")
 		number = "Anonymous";

 	console.log("Inside for submission");

 	
	console.log("Inside for submission");
	event.preventDefault();

	$.post( "/submitReport",
	   {      "person": person,
	        "doYouKnow": doYouKnow,
	        "firstTimeCrime": firstTimeCrime,
	        "incidentList": incident_list,
	        "otherIncidence": otherIncidence,
	        "location" : location,
	        "locationLat" : locationLat,
	        "locationLng": locationLng,
	        "incidentDate" : date,
	        "incidentTime" : time,
	        "comments": comments,
	        "firstName" : firstName,
	        "lastName" : lastName,
	        "email": email,
	        "number" : number}, function(response, status, xhr){
	             if(xhr.status == 200)
	             {
	                  window.open("/thankyou","_self");                   
	             }                    
        });
     

  
 	
}

function submit_contact()
{
	var contact_name = $("#contact_name").val();
	var contact_email = $("#contact_email").val();

	var message = $("textarea#message").val();

	if(message == "")
		alert("Please enter a message");
}

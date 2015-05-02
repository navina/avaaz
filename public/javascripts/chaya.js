$(document).ready(function(){
	$("#first_time").hide();
	$("#other_div").hide();
	
	$("#date").datepicker();

	$( "#date" ).datepicker( "option", "dateFormat", "yy-mm-dd" );

	$("#location").focusout(function(){ 
		onClickButton(); 
	});

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
		dropPin(document.getElementById('location').value);
		document.getElementById('map-canvas').style.display = 'block';
	}
}

function getGoogleMapApiEndpoint(address, callback) {
    var x = "https://maps.googleapis.com/maps/api/geocode/json?sensor=true&key=AIzaSyCSlmQ6fLKvbnU8u-H_Sg6qaRxEX_55nOg&address="+encodeURIComponent(address);
    
    $.ajax({url:x, success:function(result){
      var cooridnateObject = result.results[0].geometry.location
      var myLatlng = new google.maps.LatLng(cooridnateObject.lat,cooridnateObject.lng);
      
      callback(cooridnateObject)
    }});

}

function dropPin(address) {
  console.log("Address is "+address)
  getGoogleMapApiEndpoint(address, function(cooridnateObject){
	
	var myLatlng = new google.maps.LatLng(cooridnateObject.lat,cooridnateObject.lng);
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

	  document.getElementById("locationLat").value = cooridnateObject.lat;
	  document.getElementById("locationLng").value = cooridnateObject.lng;
	  console.log(document.getElementById("locationLat").value);
	  console.log(document.getElementById("locationLng").value);	
  })
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
	onSubmission(event);	
}

function validateRadio(radios)
{
    for (i = 0; i < radios.length; ++ i)
    {
        if (radios [i].checked) 
        	return 1;
    }
    return 0;
}

function onSubmission(event)
{
	var flag = true;
	$("#errorBox").css("display","none");
	$("#errorBox").text("");
	var errorBox_message = "<ul>"

	if($('input[name=person]:checked').length<=0)
	{	
		flag = false;
 		//alert("Please select who is reporting this incident");
 		errorBox_message += "<li style='color:red;float:left; '>" + "Please select who is reporting this incident" + '</li><br>';
 		$("#person_div").append("<span class='required_field required_div'>Required</span>");
 		$("#who_label").css("color","red");
 		//$("#collapseOne").addClass("in");
	}
	else
	{
		$("#who_label").css("color","black");
		$("#person_div").children('.required_div').remove();
		var person = $('input[name=person]:checked').val(); //person who is reporting
	}
	//alert("person" + person);
	var firstTimeCrime = "X";
	
	if(person == "SURVIVOR")
	{
		if($('input[name=time]:checked').length<=0)
		{	
			flag = false;
 			//alert("Please mention whether you are first time Survivor or not");
 			errorBox_message += "<li style='color:red;float:left; '>" + "Please mention whether you are first time Survivor or not" + '</li><br>';
 			$("#first_time_label").css("color","red");
 			$("#first_time").append("<span class='required_field required_div'>Required</span>");
		}
		else
		{
			$("#first_time_label").css("color","black");
			$("#first_time").children('.required_div').remove();
			firstTimeCrime = $('input[name=time]:checked').val(); //first time facing crime
		}
			
	}

	if($('input[name=assailant]:checked').length<=0)
	{	
		flag = false;
 		//alert("Please mention whether you know the Survivor or not");
 		errorBox_message += "<li style='color:red;float:left; '>" + "Please mention whether you know the assailant or not" + '</li><br>';
 		$("#whoIsReporting_div").append("<span class='required_field required_div'>Required</span>");
 		$("#whoIsReporting_label").css("color","red");
	}
	else
	{
		$("#whoIsReporting_label").css("color","black");
		$("#whoIsReporting_div").children('.required_div').remove();
		var doYouKnow = $('input[name=assailant]:checked').val(); //do you know assailant
	}

	var incident_list="";

    if ($("input[name='incident']:checked").length > 0){ 			// one ore more checkboxes are checked
  		$('.incident:checked').each(function() {
          incident_list += $(this).val() + ",";
        });
        incident_list =  incident_list.slice(0,-1);
        $("#whatIncidentToReport_label").css("color","black");
		$("#whatIncidentToReport_div").children('.required_div').remove();
        //alert(incident_list);
	}
	else{
			flag = false;
 			//alert("Please select one or more incident(s)");// no checkboxes are checked
 			errorBox_message += "<li style='color:red;float:left; '>" +  "Please select one or more incident(s)" + '</li><br>';
 			$("#whatIncidentToReport_div").append("<span class='required_field required_div'>Required</span>");
 			$("#whatIncidentToReport_label").css("color","red");	
	}	

    var otherIncidence="Not Applicable";
     
    if(incident_list.indexOf("OTHER_INCIDENT")!=-1)
    {
    	otherIncidence = $("#other").val();
    	if(otherIncidence == "")
    	{
    		//alert("please provide other incident");
    		errorBox_message += "<li style='color:red;float:left; '>" + "Please provide other incident" +'</li><br>';
    		flag = false;
    		$("#other_div").append("<span class='required_field required_div'>Required</span>");
 			$("#other_label").css("color","red");
    	}
    	else
    	{
    		$("#other_div").children('.required_div').remove();
 			$("#other_label").css("color","black");
    	}
    }
 	
 	//alert(incident_description);
 	
	var location = $("#location").val();
	if(location == ""){
		flag = false;
		//alert("Please enter your location");
		errorBox_message += "<li style='color:red;float:left; '>" + "Please enter your location" +'</li><br>';
		$("#location_div").append("<span class='required_field required_div'>Required</span>");
 		$("#location_label").css("color","red");
	}
	else
	{
		$("#location_div").css("color","black");
		$("#location_label").children('.required_div').remove();
	}
	//alert("location" + location);

	var locationLat = $("#locationLat").val();
	var locationLng = $("#locationLng").val();

	if(locationLat == "" || locationLng == "")
	{
		getGoogleMapApiEndpoint($("#location").val());
	}

	//alert(locationLat + " " + locationLng);

	var date = $("#date").val();
	if(date == ""){
		flag = false;
		//alert("please enter date of incident");
		errorBox_message += "<li style='color:red;float:left; '>" + "Please enter date of incident" +'</li><br>';
		$("#date_div").append("<span class='required_field required_div'>Required</span>");
 		$("#date_label").css("color","red");
	}
	else
	{
		$("#date_div").css("color","black");
		$("#date_label").children('.required_div').remove();
	}

	//alert("Date" + date);

	var time = $("#time").val();
	if(time == ""){
		flag = false;
	//	alert("please enter time of incident");
		errorBox_message += "<li style='color:red;float:left; '>" + "Please enter time of incident" + '</li><br>';
		$("#time_div").append("<span class='required_field required_div'>Required</span>");
 		$("#time_label").css("color","red");
	}
	else
	{
		$("#time_div").css("color","black");
		$("#time_label").children('.required_div').remove();
	}

	//alert("time" + time);
	
 	var comments = $("textarea#additional_info").val();

 	var firstName = $("#firstName").val() == "" ? undefined :  $("#firstName").val();
 	var lastName = $("#lastName").val() == "" ? undefined :  $("#lastName").val();
 	var email = $("#email").val() == "" ? undefined :  $("#email").val();
 	var number = $("#number").val() == "" ? undefined :  $("#number").val();

 	//console.log("Inside for submission");
 	
	event.preventDefault();
	
	if(!flag)
	{
		$("#errorBox").css("display","block");
		errorBox_message += "</ul>";
		$("#errorBox").html(errorBox_message);	
		//console.log(errorBox_message);
		window.scrollTo(0, 0);	
	}
	else
	{
		$.post( "/submitReport", {    
	   		"person": person,
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
	        "number" : number
	    }, function(response, status, xhr) {
			if(xhr.status == 200)
			{
			  window.open("/thankyou","_self");                   
			}                  
        });

	}
	//alert("before post");
	
 	
}

function submit_contact()
{
	var contact_name = $("#contact_name").val();
	var contact_email = $("#contact_email").val();

	var message = $("textarea#message").val();

	if(message == "")
		alert("Please enter a message");
}

function submit_connect()
{
	var locality = $("#connect_locality").val();
	var city = $("#connect_city").val();
	var state = $("#connect_state").val();
	var connectTo = $("#connect_to").val();
	var address = locality + ", " + city + ", " + state;

	if(city.trim() == "")
	{
		alert( "please enter your city" );
		$("#connect_city").focus();
		return false;
		
	} else if(state.trim() == "")
	{
		alert( "please enter your state" );
		$("#connect_state").focus();
		return false;
		
	}

	var viewOrgUrl = "/viewOrg?orgType="+connectTo+"&state="+encodeURIComponent(state.trim())+"&city="+encodeURIComponent(city.trim());
	var contact = "";
	var i = 0;

	getGoogleMapApiEndpoint(address, function(cooridnateObject){
		//call backend for coordinates closed to cooridnateObject
		$.ajax({
    		url: '/viewOrg',
    		data: {'orgType':connectTo,'state':state.trim(),'city':city.trim()},
    		success: function(result){
    			while (result[i]) {
    				contact += "<li>Phone: "+result[i].phone;
    				if(result[i].addressLine.trim()!=""){
    					contact += "<br/>Address: "+result[i].addressLine+", "+result[i].city;

    					if(result[i].locality.trim()!=""){
    						contact += ", "+result[i].locality;
    					}

    					contact += ", "+result[i].state+", "+result[i].pincode+"</li>";
    				}

    				i++;
				}
				
				if(result!=""){
					contact = "<ul>"+contact+"</ul>";
				}

				if(contact==""){
					contact = "No connect contact found for your search!!"
				}

				document.getElementById("connect_contact").innerHTML  = contact;
    		}
		});
		
	});

	return false;
}

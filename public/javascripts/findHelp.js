$(document).ready(function() {

  $("ul.findHelp-menu li a").click(function() {
    var selText = $(this).text();
    $(this).parents('.input-group').find('button[data-toggle="dropdown"]').html(selText+' <span class="caret"></span>');
  });


  $("#findHelpForm").submit(function() {
    // reference: http://www.mattlunn.me.uk/blog/2012/10/submitting-a-form-as-an-ajax-request-using-jquery/
    // stop the form from submitting the normal way and refreshing the page
    var formData = {
        'address'         : $('input[name=address]').val()
      };
      getGoogleMapApiEndpoint(formData.address)
      event.preventDefault();
      /*
      event.preventDefault();
    $.ajax({
        data    : $(this).serialize(), // our data object
        dataType  : 'json' // what type of data do we expect back from the server
      }).done(function(data){
        console.log("test")
        console.log(data);    
      })
      */  
      // geocoding apiKey: AIzaSyCSlmQ6fLKvbnU8u-H_Sg6qaRxEX_55nOg
  });
});

function getGoogleMapApiEndpoint(address) {
    var x = "https://maps.googleapis.com/maps/api/geocode/json?sensor=true&key=AIzaSyCSlmQ6fLKvbnU8u-H_Sg6qaRxEX_55nOg&address="+encodeURIComponent(address);
    
    $.ajax({url:x,success:function(result){
      var cooridnateObject = result.results[0].geometry.location
      console.log(cooridnateObject.lat+" "+cooridnateObject.lng)
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
}
$(document).ready(function(){
	$("#first_time").hide();
	$("#other_div").hide();

});


function first_time_display()
{
	var val = $('input[name=person]:checked').val();
	if(val == "Survivor")
	{
		$("#first_time").show();
	}
  	else
  	{
  		$("#first_time").hide();
  	}
}

function describe_Incident()
{
	$("#other_div").show();
}

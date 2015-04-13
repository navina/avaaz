$(document).ready(function() {
    console.log( "ready!" );
});

$(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    if (scroll >= 500) {
        $("nav.navbar").removeClass("navbar-transparent");
    } else {
        $("nav.navbar").addClass("navbar-transparent");
    }

    if (scroll >= 5) {
        $(".down-arrow").hide();
    } else {
        $(".down-arrow").show();
    }
}); //missing );
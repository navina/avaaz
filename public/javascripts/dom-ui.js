$(document).ready(function() {
    console.log( "ready!" );
    smoothScroll.init({
        speed: 1000, // Integer. How fast to complete the scroll in milliseconds
        easing: 'easeInOutQuad', // Easing pattern to use
    });
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
});
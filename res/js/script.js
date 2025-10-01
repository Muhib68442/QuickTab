$(document).ready(function(){



    // CAROUSEL
    let current = 0;
    const slides = $(".carousel img");
    const total = slides.length;

    setInterval(function(){
    slides.eq(current).fadeOut(1000).removeClass("active");
    current = (current + 1) % total;
    slides.eq(current).fadeIn(1000).addClass("active");
    }, 3000);


    // CAROUSEL 2


    let now = 0;
    const slides2 = $("#mySlider .slideImg");
    const totalSlides2 = slides2.length;
    const featureItems = $("ul.feature-list li");

    // initialize
    slides2.hide().eq(now).fadeIn(200).addClass("showing");
    featureItems.removeClass("selected").eq(now).addClass("selected");

    setInterval(function(){
        // slide change
        slides2.eq(now).fadeOut(900).removeClass("showing");
        featureItems.eq(now).removeClass("selected");

        now = (now + 1) % totalSlides2;

        slides2.eq(now).fadeIn(900).addClass("showing");
        featureItems.eq(now).addClass("selected");
    }, 2800);



    // FOOTER YEAR
    let year = new Date().getFullYear();
    $("#year").text(year);



});
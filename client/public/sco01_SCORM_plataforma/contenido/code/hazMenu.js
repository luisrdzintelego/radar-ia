/* function SmoothScrollTo(id_or_Name, timelength){
  var timelength = timelength || 1000;
  $('html, body').animate({
    scrollTop: $(id_or_Name).offset().top-100
  }, timelength, 'swing', function(){
    window.location.hash = id_or_Name;
  });
}
SmoothScrollTo(('#'+secciones[i-1]), 1000); */

$(document).ready(function () {
  $(".nav-menu-2").hide();
});

$(".nav-wrap").keypress(function (e) {

  //if (wp.debugMode) console.log("click id: ", e.currentTarget.id.substr(4));

  var key = e.which;
  if (key == 13)  // the enter key code
  {
    //window.open("descargas/infografia_spei.pdf", "_blank");
    $(this).click();
    return false;
  }
});

$(".nav-wrap").click(function (e) {
  if (wp.debugMode) console.log("🚀 ~ nav-wrap:click")

  /* if($(element).is(":visible") == true){
    $(".nav-menu-2").hide();
  } else {
    $(".nav-menu-2").hide();
  } */

  $(".nav-menu-2").fadeToggle();
});

var root = this;
var secciones = ['sec1', 'sec2', 'sec3', 'sec4', 'sec5', 'sec6', 'sec7', 'sec8', 'sec9'];

$(function () {
  for (i = 1; i <= secciones.length; i++) {
    (function (i) {
      $(".btn" + i).click(function () {
        if (wp.debugMode) console.log("BTN" + i)
        //$(".nav-wrap").click();
        //root["chk" + i] = true;
        var body = $("html, body");
        body.stop().animate({ scrollTop: ($('.' + secciones[i - 1]).offset().top - 50) }, 1000, 'swing', function () {
          //alert("Finished animating");
          $(".tit_sec" + i).focus();

        });
      });
    })(i);
  }
});



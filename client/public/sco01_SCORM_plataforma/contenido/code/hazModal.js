function HazModal(_str) {
  Resize();
  var ruta = "";
  mi_ruta = _str;
  switch (_str) {
    case "video1":
      //setCurrentPage(3);
      ruta = "interactivos/1_ABUSO_AUTORIDAD/index.html";
      break;
    case "video2":
      //setCurrentPage(3);
      ruta = "interactivos/2_CONFLICTO_INTERESES/index.html";
      break;
    case "video3":
      //setCurrentPage(3);
      ruta = "interactivos/3_CI_ACTIVIDADES_EXTERNAS/index.html";
      break;
    case "video4":
      //setCurrentPage(3);
      ruta = "interactivos/4_SEGURIDAD_INFORMACION/index.html";
      break;
    case "video5":
      //setCurrentPage(3);
      ruta = "interactivos/5_CORRUPCION/index.html";
      break;
    case "video6":
      //setCurrentPage(3);
      ruta = "interactivos/6_SOBORNOS/index.html";
      break;
    case "video7":
      //setCurrentPage(3);
      ruta = "interactivos/7_MEDIOS_SOCIALES/index.html";
      break;
  }
  //if (wp.debugMode) console.log("ruta: " + ruta); 
  //if (wp.debugMode) console.log(ruta.lastIndexOf("pdf"));
  if (ruta.lastIndexOf("pdf") != -1 || ruta.lastIndexOf("http") != -1) {
    // actualiza el currentPage de donde estoy
    //setCurrentPage(2);
    /* Guarda la calificacion */
    //saveGrade();   
    // abre el pdf o la liga
    window.open(ruta, "_blank");
  } else if (ruta.indexOf("popup") != -1) {
    /* setTimeout(function(){
         mod.classList.add("visible");
     },100);*/
  } else if (ruta != "") {
    if (wp.debugMode) console.log("🚀 ~ ruta:", ruta)

    //$(".w-nav-brand").click();
    //$("body").css('overflow','hidden')

    $("body").addClass('noscroll')

    var iframRecursosNuevos_ = document.getElementById("popupMC");
    iframRecursosNuevos_.style.display = "block";
    iframRecursosNuevos_.style.opacity = "1";
    if (wp.debugMode) console.log("Asigna : " + ruta);
    var iframRecursosNuevo_ = document.getElementById("popup1");
    iframRecursosNuevo_.src = ruta;

  }
}
// ocultar div de popup      
function HazCerrar() {
  //if (wp.debugMode) console.log("cerrar MODAL::::");
  // ocultar y colocar en opacity 0 a DIV de pop
  var iframRecursosNuevo_ = document.getElementById("popupMC");
  iframRecursosNuevo_.style.display = "none";
  iframRecursosNuevo_.style.opacity = "0";
  // quitar el contenido del iframe
  var iframRecursosNuevo2_ = document.getElementById("popup1");
  iframRecursosNuevo2_.src = "";
  //$("body").css('overflow', 'visible')
  $("body").removeClass('noscroll')
}
// funcion para que la ventana popup se redimensione
function Resize() {
  //if (wp.debugMode) console.log("Resixe");
  /* var iframRecursosNuevo_ = document.getElementById("popup1");
  iframRecursosNuevo_.style.height = (window.innerHeight * .8) + "px";
  iframRecursosNuevo_.style.marginTop = 0 + "px"; */

  //var windowHeight = parseInt($(".video_storie1").css("height")) * 0.8;
  
  $("#popup1").css("height", (window.innerHeight * .8) + "px")
  $('#popup1').css('margin-top', 10 + "px");
  $("#popup1").css("width", "80%")


}
window.onresize = function () {
  Resize();
}
Resize();

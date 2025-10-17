//event.preventDefault ? event.preventDefault() : (event.returnValue = false);

function HazModal(_str) {
  Resize();
  var ruta = "";
  mi_ruta = _str;
  switch (_str) {
    case "video":
      //setCurrentPage(3);
      ruta = "videos/indexp1_v0.html";
      break;
    case "ilm":
      //setCurrentPage(3);
      ruta = "ilm/ilm.html";
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
    $(".w-nav-brand").click();
    //$("body").css('overflow','hidden')
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
  $("body").css('overflow', 'visible')
}
// funcion para que la ventana popup se redimensione
function Resize() {
  //if (wp.debugMode) console.log("Resixe");
  var iframRecursosNuevo_ = document.getElementById("popup1");
  iframRecursosNuevo_.style.height = (window.innerHeight * 1) + "px";
  iframRecursosNuevo_.style.marginTop = 0 + "px";
}
window.onresize = function () {
  Resize();
}
Resize();
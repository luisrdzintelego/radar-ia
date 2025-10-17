function hazSeccion(goTo, este_btn) {
  if (wp.debugMode) console.log("🚀 ~ goTo:-----", goTo)

  let ruta_ = "";

    switch (goTo) {

      case 1:
        ruta_ = "index.html";
        break;
      case 2:
        ruta_ = "bienvenida.html";
        break;
      case 3:
        ruta_ = "modulo1.html";
        break;
      case 4:
        ruta_ = "modulo2.html";
        break;
      case 5:
        ruta_ = "modulo3.html";
        break;
    }


 /*  if (window.parent.idioma == 'esp') {
    switch (goTo) {

      case 1:
        ruta_ = "00_esp/index.html";
        break;
      case 2:
        ruta_ = "00_esp/bienvenida.html";
        break;
      case 3:
        ruta_ = "00_esp/modulo1.html";
        break;
      case 4:
        ruta_ = "00_esp/modulo2.html";
        break;
      case 5:
        ruta_ = "00_esp/modulo3.html";
        break;
    }

  } else if (window.parent.idioma == 'ing') {
    switch (goTo) {

      case 1:
        ruta_ = "00_ing/index.html";
        break;
      case 2:
        ruta_ = "00_ing/bienvenida.html";
        break;
      case 3:
        ruta_ = "00_ing/modulo1.html";
        break;
      case 4:
        ruta_ = "00_ing/modulo2.html";
        break;
      case 5:
        ruta_ = "00_ing/modulo3.html";
        break;
    }

  } else if (window.parent.idioma == 'por') {
    switch (goTo) {

      case 1:
        ruta_ = "00_por/index.html";
        break;
      case 2:
        ruta_ = "00_por/bienvenida.html";
        break;
      case 3:
        ruta_ = "00_por/modulo1.html";
        break;
      case 4:
        ruta_ = "00_por/modulo2.html";
        break;
      case 5:
        ruta_ = "00_por/modulo3.html";
        break;
    }

  } */


  if (este_btn) {
    if (wp.debugMode) console.log("🚀 ~ OBJETO:-----", este_btn)
    var lastClass = $(este_btn).attr('class').split(' ').pop();
    if (wp.debugMode) console.log("---- lastClass", lastClass)
    if (wp.debugMode) console.log("---- lastClass DISABLED", $(este_btn).hasClass("disabled"))

    /*
    if(window.parent.getPageStatus(goTo+1)>1 || $(this).hasClass("disabled")==false){
      window.open(ruta_, "_self");
    }
    */
    //if (wp.debugMode) console.log("---- getPageStatus", window.parent.getPageStatus(goTo+1))
    //if (wp.debugMode) console.log("---- getPage", window.parent.getPages()[goTo])
    //if (wp.debugMode) console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", window.parent.getPages()[goTo])

    if ($(este_btn).hasClass("disabled") == false) {
      
      window.open('../00_' + window.parent.idioma + '/' + ruta_, "_self");
    
    }
  } else {
    //window.open(ruta_, "_self");
      window.open('../00_' + window.parent.idioma + '/' + ruta_, "_self");
  }
  //window.open(ruta_, "_self");
}
//completa la lamina y brinca a la que le indiques
function complete_go(completa, goTo, este_boton) {

  if(completa != 99){
    if (window.parent.getPageStatus(completa) != 3) {
      window.parent.setCurrentPage(completa);
      window.parent.setCalif(1, 1, 3);
    }
  }

  hazSeccion(goTo, este_boton);
  //window.open("que-es-el-acr.html", "_self");
}

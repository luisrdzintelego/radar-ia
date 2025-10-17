  if (wp.debugMode) console.log('👻 HazRol-----');
  
  rol_actual = window.parent.rol;
  if (wp.debugMode) console.log("rol   ----- ", window.parent.rol)
  /* if (wp.debugMode) console.log("name ----- ", window.parent.avatar) */

  if(rol_actual == 4){

    //$(".evaluacion").hide();
    $(".caso").hide();
    //$(".test").css("display", "flex").show();

  } else if(rol_actual > 0 && rol_actual < 4 ){

    //$(".evaluacion").css("display", "flex").show();
    $(".caso").css("display", "flex").show();
    //$(".test").hide();

  }

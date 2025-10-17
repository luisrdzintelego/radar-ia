$(document).ready(function () {
  
  $("html, body").animate({ scrollTop: 0 }, "slow");

  if (wp.debugMode) console.log("name ----- ", window.parent.nombre)
  /* if (wp.debugMode) console.log("name ----- ", window.parent.avatar) */

  /*--avatar--*/
  /* change_img_svg("avatar",("Avatar"+window.parent.avatar)); */
  /*--nombre--*/
  $(".nombre_var").html("<b>" + window.parent.nombre + "</b>");
  /*--nombre--*/        

});

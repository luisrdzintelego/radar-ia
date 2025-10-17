/* var tarj_actual5 = 1;
var tarjetas5 = [1,0,0,0,0,0,0,0,0];

function chk_fin_slider5() {
	var n = 0;
	for (i = 0; i < tarjetas5.length; i++) {
	  tarjetas5[i] == 1 ? n++ : '';
	}
	if (wp.debugMode) console.log("🚀 ~ n:", n)
	if (n == tarjetas5.length && root["chk" + 4] == false) {
	  root["chk" + 4] = true;
	  chk_btns(4);
	}
} */

function chk_adelante5() {
  //if (wp.debugMode) console.log("🚀 ~ init_tarjetas5:")
  //if (wp.debugMode) console.log("🚀 ~ tarjetas5:", tarjetas5)
  if (wp.debugMode) console.log("🚀 ~ tarj_actual5:", tarj_actual5)

  for (i = 1; i <= tarjetas5.length; i++) {
	$(".panel5" + i).removeClass('animate__fadeIn');
	$(".panel5" + i).hide();
  }

  $(".panel5" + tarj_actual5).show().addClass('animate__fadeIn');
  $(".panel5" + tarj_actual5).focus();

  tarj_actual5 <= 1 ? $('.btn-atras5').addClass('disabled') : $('.btn-atras5').removeClass('disabled');
  tarj_actual5 >= tarjetas5.length ? $('.btn-adelante5').addClass('disabled') : $('.btn-adelante5').removeClass('disabled');

  chk_fin_slider5();

}

function chk_atras5() {
  //if (wp.debugMode) console.log("🚀 ~ init_tarjetas5:")
  //if (wp.debugMode) console.log("🚀 ~ tarjetas5:", tarjetas5)
  if (wp.debugMode) console.log("🚀 ~ tarj_actual5:", tarj_actual5)

  for (i = 1; i <= tarjetas5.length; i++) {
	$(".panel5" + i).removeClass('animate__fadeIn');
	$(".panel5" + i).hide();
  }

  $(".panel5" + tarj_actual5).show().addClass('animate__fadeIn');
  $(".panel5" + tarj_actual5).focus();

  tarj_actual5 <= 1 ? $('.btn-atras5').addClass('disabled') : $('.btn-atras5').removeClass('disabled');
  tarj_actual5 >= tarjetas5.length ? $('.btn-adelante5').addClass('disabled') : $('.btn-adelante5').removeClass('disabled');

  chk_fin_slider5();

}

$('.btn-adelante5').on('click', function () {
  tarj_actual5 += 1;
  tarjetas5[tarj_actual5 - 1] = 1;
  chk_adelante5();
});

$('.btn-atras5').on('click', function () {
  tarj_actual5 -= 1;
  chk_atras5();
});

$(document).ready(function () {
  for (i = 1; i <= tarjetas5.length; i++) {
	$(".panel5" + i).hide();
  }
  $(".panel5" + tarj_actual5).show();
});

  $(function () {
	for (i = 1; i <= tarjetas5.length; i++) {
	  (function (i) {
		
		$(".panel5" + i).keydown(function (e) {
		  if (wp.debugMode) console.log("🚀 ~ i:", i)
		  var key = e.which;

			//&& tarj_actual5 < tarjetas5.length
		  if (key == 9)  // the enter key code
		  {
			//e.preventDefault();
			//window.open("descargas/infografia_spei.pdf", "_blank");
			//$('.btn-adelante5').click();

			//if (wp.debugMode) console.log("🚀 ~ key:", $('.btn-atras5').is(":disabled"))
			if (wp.debugMode) console.log("🚀 ~ e.shiftKey:", e.shiftKey)

			/* if (wp.debugMode) console.log("🚀 ~ tarj_actual5 <= 1:", tarj_actual5 <= 1)
			if (wp.debugMode) console.log("🚀 ~ tarj_actual5 >= tarjetas5.length :", tarj_actual5 >= tarjetas5.length )
			if (wp.debugMode) console.log("🚀 ~ tarj_actual5 :", tarj_actual5 )
			if (wp.debugMode) console.log("🚀 ~ tarjetas5.length :", tarjetas5.length ) */

			if (e.shiftKey) {

			  tarj_actual5 <= 1 ? $('.prev_from_slider5').focus() : $('.btn-atras5').click();
			}
			else {
			  tarj_actual5 >= tarjetas5.length ? $('.next_from_slider5').focus() : $('.btn-adelante5').click();
			}

			return false;
		  }

		  /* if ($(this).is(":focus")) {} */
		  //if (wp.debugMode) console.log("click id: ", e.currentTarget.id.substr(4));

		});
	  })(i);
	}
  });

  /*-----------------*/
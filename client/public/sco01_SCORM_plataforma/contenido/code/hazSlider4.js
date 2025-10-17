/* var tarj_actual4 = 1;
var tarjetas4 = [1,0,0,0,0,0,0,0,0];

function chk_fin_slider4() {
	var n = 0;
	for (i = 0; i < tarjetas4.length; i++) {
	  tarjetas4[i] == 1 ? n++ : '';
	}
	if (wp.debugMode) console.log("🚀 ~ n:", n)
	if (n == tarjetas4.length && root["chk" + 4] == false) {
	  root["chk" + 4] = true;
	  chk_btns(4);
	}
} */

function chk_adelante4() {
  //if (wp.debugMode) console.log("🚀 ~ init_tarjetas4:")
  //if (wp.debugMode) console.log("🚀 ~ tarjetas4:", tarjetas4)
  if (wp.debugMode) console.log("🚀 ~ tarj_actual4:", tarj_actual4)

  for (i = 1; i <= tarjetas4.length; i++) {
	$(".panel4" + i).removeClass('animate__fadeIn');
	$(".panel4" + i).hide();
  }

  $(".panel4" + tarj_actual4).show().addClass('animate__fadeIn');
  $(".panel4" + tarj_actual4).focus();

  tarj_actual4 <= 1 ? $('.btn-atras4').addClass('disabled') : $('.btn-atras4').removeClass('disabled');
  tarj_actual4 >= tarjetas4.length ? $('.btn-adelante4').addClass('disabled') : $('.btn-adelante4').removeClass('disabled');

  chk_fin_slider4();

}

function chk_atras4() {
  //if (wp.debugMode) console.log("🚀 ~ init_tarjetas4:")
  //if (wp.debugMode) console.log("🚀 ~ tarjetas4:", tarjetas4)
  if (wp.debugMode) console.log("🚀 ~ tarj_actual4:", tarj_actual4)

  for (i = 1; i <= tarjetas4.length; i++) {
	$(".panel4" + i).removeClass('animate__fadeIn');
	$(".panel4" + i).hide();
  }

  $(".panel4" + tarj_actual4).show().addClass('animate__fadeIn');
  $(".panel4" + tarj_actual4).focus();

  tarj_actual4 <= 1 ? $('.btn-atras4').addClass('disabled') : $('.btn-atras4').removeClass('disabled');
  tarj_actual4 >= tarjetas4.length ? $('.btn-adelante4').addClass('disabled') : $('.btn-adelante4').removeClass('disabled');

  chk_fin_slider4();

}

$('.btn-adelante4').on('click', function () {
  tarj_actual4 += 1;
  tarjetas4[tarj_actual4 - 1] = 1;
  chk_adelante4();
});

$('.btn-atras4').on('click', function () {
  tarj_actual4 -= 1;
  chk_atras4();
});

$(document).ready(function () {
  for (i = 1; i <= tarjetas4.length; i++) {
	$(".panel4" + i).hide();
  }
  $(".panel4" + tarj_actual4).show();
});

  $(function () {
	for (i = 1; i <= tarjetas4.length; i++) {
	  (function (i) {
		
		$(".panel4" + i).keydown(function (e) {
		  if (wp.debugMode) console.log("🚀 ~ i:", i)
		  var key = e.which;

			//&& tarj_actual4 < tarjetas4.length
		  if (key == 9)  // the enter key code
		  {
			//e.preventDefault();
			//window.open("descargas/infografia_spei.pdf", "_blank");
			//$('.btn-adelante4').click();

			//if (wp.debugMode) console.log("🚀 ~ key:", $('.btn-atras4').is(":disabled"))
			if (wp.debugMode) console.log("🚀 ~ e.shiftKey:", e.shiftKey)

			/* if (wp.debugMode) console.log("🚀 ~ tarj_actual4 <= 1:", tarj_actual4 <= 1)
			if (wp.debugMode) console.log("🚀 ~ tarj_actual4 >= tarjetas4.length :", tarj_actual4 >= tarjetas4.length )
			if (wp.debugMode) console.log("🚀 ~ tarj_actual4 :", tarj_actual4 )
			if (wp.debugMode) console.log("🚀 ~ tarjetas4.length :", tarjetas4.length ) */

			if (e.shiftKey) {

			  tarj_actual4 <= 1 ? $('.prev_from_slider4').focus() : $('.btn-atras4').click();
			}
			else {
			  tarj_actual4 >= tarjetas4.length ? $('.next_from_slider4').focus() : $('.btn-adelante4').click();
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
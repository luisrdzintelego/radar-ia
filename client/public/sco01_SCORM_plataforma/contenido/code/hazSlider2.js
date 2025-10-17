/* var tarj_actual2 = 1;
var tarjetas2 = [1,0,0,0,0,0,0,0,0];

function chk_fin_slider2() {
	var n = 0;
	for (i = 0; i < tarjetas2.length; i++) {
	  tarjetas2[i] == 1 ? n++ : '';
	}
	if (wp.debugMode) console.log("🚀 ~ n:", n)
	if (n == tarjetas2.length && root["chk" + 4] == false) {
	  root["chk" + 4] = true;
	  chk_btns(4);
	}
} */

function chk_adelante2() {
  //if (wp.debugMode) console.log("🚀 ~ init_tarjetas2:")
  //if (wp.debugMode) console.log("🚀 ~ tarjetas2:", tarjetas2)
  if (wp.debugMode) console.log("🚀 ~ tarj_actual2:", tarj_actual2)

  for (i = 1; i <= tarjetas2.length; i++) {
	$(".panel2" + i).removeClass('animate__fadeIn');
	$(".panel2" + i).hide();
  }

  $(".panel2" + tarj_actual2).show().addClass('animate__fadeIn');
  $(".panel2" + tarj_actual2).focus();

  tarj_actual2 <= 1 ? $('.btn-atras2').addClass('disabled') : $('.btn-atras2').removeClass('disabled');
  tarj_actual2 >= tarjetas2.length ? $('.btn-adelante2').addClass('disabled') : $('.btn-adelante2').removeClass('disabled');

  chk_fin_slider2();

}

function chk_atras2() {
  //if (wp.debugMode) console.log("🚀 ~ init_tarjetas2:")
  //if (wp.debugMode) console.log("🚀 ~ tarjetas2:", tarjetas2)
  if (wp.debugMode) console.log("🚀 ~ tarj_actual2:", tarj_actual2)

  for (i = 1; i <= tarjetas2.length; i++) {
	$(".panel2" + i).removeClass('animate__fadeIn');
	$(".panel2" + i).hide();
  }

  $(".panel2" + tarj_actual2).show().addClass('animate__fadeIn');
  $(".panel2" + tarj_actual2).focus();

  tarj_actual2 <= 1 ? $('.btn-atras2').addClass('disabled') : $('.btn-atras2').removeClass('disabled');
  tarj_actual2 >= tarjetas2.length ? $('.btn-adelante2').addClass('disabled') : $('.btn-adelante2').removeClass('disabled');

  chk_fin_slider2();

}

$('.btn-adelante2').on('click', function () {
  tarj_actual2 += 1;
  tarjetas2[tarj_actual2 - 1] = 1;
  chk_adelante2();
});

$('.btn-atras2').on('click', function () {
  tarj_actual2 -= 1;
  chk_atras2();
});

$(document).ready(function () {
  for (i = 1; i <= tarjetas2.length; i++) {
	$(".panel2" + i).hide();
  }
  $(".panel2" + tarj_actual2).show();
});

  $(function () {
	for (i = 1; i <= tarjetas2.length; i++) {
	  (function (i) {
		
		$(".panel2" + i).keydown(function (e) {
		  if (wp.debugMode) console.log("🚀 ~ i:", i)
		  var key = e.which;

			//&& tarj_actual2 < tarjetas2.length
		  if (key == 9)  // the enter key code
		  {
			//e.preventDefault();
			//window.open("descargas/infografia_spei.pdf", "_blank");
			//$('.btn-adelante2').click();

			//if (wp.debugMode) console.log("🚀 ~ key:", $('.btn-atras2').is(":disabled"))
			if (wp.debugMode) console.log("🚀 ~ e.shiftKey:", e.shiftKey)

			/* if (wp.debugMode) console.log("🚀 ~ tarj_actual2 <= 1:", tarj_actual2 <= 1)
			if (wp.debugMode) console.log("🚀 ~ tarj_actual2 >= tarjetas2.length :", tarj_actual2 >= tarjetas2.length )
			if (wp.debugMode) console.log("🚀 ~ tarj_actual2 :", tarj_actual2 )
			if (wp.debugMode) console.log("🚀 ~ tarjetas2.length :", tarjetas2.length ) */

			if (e.shiftKey) {

			  tarj_actual2 <= 1 ? $('.prev_from_slider2').focus() : $('.btn-atras2').click();
			}
			else {
			  tarj_actual2 >= tarjetas2.length ? $('.next_from_slider2').focus() : $('.btn-adelante2').click();
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
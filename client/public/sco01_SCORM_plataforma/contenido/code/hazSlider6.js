/* var tarj_actual6 = 1;
var tarjetas6 = [1,0,0,0,0,0,0,0,0];

function chk_fin_slider6() {
	var n = 0;
	for (i = 0; i < tarjetas6.length; i++) {
	  tarjetas6[i] == 1 ? n++ : '';
	}
	if (wp.debugMode) console.log("🚀 ~ n:", n)
	if (n == tarjetas6.length && root["chk" + 4] == false) {
	  root["chk" + 4] = true;
	  chk_btns(4);
	}
} */

function chk_adelante6() {
  //if (wp.debugMode) console.log("🚀 ~ init_tarjetas6:")
  //if (wp.debugMode) console.log("🚀 ~ tarjetas6:", tarjetas6)
  if (wp.debugMode) console.log("🚀 ~ tarj_actual6:", tarj_actual6)

  for (i = 1; i <= tarjetas6.length; i++) {
	$(".panel6" + i).removeClass('animate__fadeIn');
	$(".panel6" + i).hide();
  }

  $(".panel6" + tarj_actual6).show().addClass('animate__fadeIn');
  $(".panel6" + tarj_actual6).focus();

  tarj_actual6 <= 1 ? $('.btn-atras6').addClass('disabled') : $('.btn-atras6').removeClass('disabled');
  tarj_actual6 >= tarjetas6.length ? $('.btn-adelante6').addClass('disabled') : $('.btn-adelante6').removeClass('disabled');

  chk_fin_slider6();

}

function chk_atras5() {
  //if (wp.debugMode) console.log("🚀 ~ init_tarjetas6:")
  //if (wp.debugMode) console.log("🚀 ~ tarjetas6:", tarjetas6)
  if (wp.debugMode) console.log("🚀 ~ tarj_actual6:", tarj_actual6)

  for (i = 1; i <= tarjetas6.length; i++) {
	$(".panel6" + i).removeClass('animate__fadeIn');
	$(".panel6" + i).hide();
  }

  $(".panel6" + tarj_actual6).show().addClass('animate__fadeIn');
  $(".panel6" + tarj_actual6).focus();

  tarj_actual6 <= 1 ? $('.btn-atras6').addClass('disabled') : $('.btn-atras6').removeClass('disabled');
  tarj_actual6 >= tarjetas6.length ? $('.btn-adelante6').addClass('disabled') : $('.btn-adelante6').removeClass('disabled');

  chk_fin_slider6();

}

$('.btn-adelante6').on('click', function () {
  tarj_actual6 += 1;
  tarjetas6[tarj_actual6 - 1] = 1;
  chk_adelante6();
});

$('.btn-atras6').on('click', function () {
  tarj_actual6 -= 1;
  chk_atras5();
});

$(document).ready(function () {
  for (i = 1; i <= tarjetas6.length; i++) {
	$(".panel6" + i).hide();
  }
  $(".panel6" + tarj_actual6).show();
});

  $(function () {
	for (i = 1; i <= tarjetas6.length; i++) {
	  (function (i) {
		
		$(".panel6" + i).keydown(function (e) {
		  if (wp.debugMode) console.log("🚀 ~ i:", i)
		  var key = e.which;

			//&& tarj_actual6 < tarjetas6.length
		  if (key == 9)  // the enter key code
		  {
			//e.preventDefault();
			//window.open("descargas/infografia_spei.pdf", "_blank");
			//$('.btn-adelante6').click();

			//if (wp.debugMode) console.log("🚀 ~ key:", $('.btn-atras6').is(":disabled"))
			if (wp.debugMode) console.log("🚀 ~ e.shiftKey:", e.shiftKey)

			/* if (wp.debugMode) console.log("🚀 ~ tarj_actual6 <= 1:", tarj_actual6 <= 1)
			if (wp.debugMode) console.log("🚀 ~ tarj_actual6 >= tarjetas6.length :", tarj_actual6 >= tarjetas6.length )
			if (wp.debugMode) console.log("🚀 ~ tarj_actual6 :", tarj_actual6 )
			if (wp.debugMode) console.log("🚀 ~ tarjetas6.length :", tarjetas6.length ) */

			if (e.shiftKey) {

			  tarj_actual6 <= 1 ? $('.prev_from_slider6').focus() : $('.btn-atras6').click();
			}
			else {
			  tarj_actual6 >= tarjetas6.length ? $('.next_from_slider6').focus() : $('.btn-adelante6').click();
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
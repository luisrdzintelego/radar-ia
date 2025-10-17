/* var tarj_actual3 = 1;
var tarjetas3 = [1,0,0,0,0,0,0,0,0];

function chk_fin_slider3() {
	var n = 0;
	for (i = 0; i < tarjetas3.length; i++) {
	  tarjetas3[i] == 1 ? n++ : '';
	}
	if (wp.debugMode) console.log("🚀 ~ n:", n)
	if (n == tarjetas3.length && root["chk" + 4] == false) {
	  root["chk" + 4] = true;
	  chk_btns(4);
	}
} */

function chk_adelante3() {
  //if (wp.debugMode) console.log("🚀 ~ init_tarjetas3:")
  //if (wp.debugMode) console.log("🚀 ~ tarjetas3:", tarjetas3)
  if (wp.debugMode) console.log("🚀 ~ tarj_actual3:", tarj_actual3)

  for (i = 1; i <= tarjetas3.length; i++) {
	$(".panel3" + i).removeClass('animate__fadeIn');
	$(".panel3" + i).hide();
  }

  $(".panel3" + tarj_actual3).show().addClass('animate__fadeIn');
  $(".panel3" + tarj_actual3).focus();

  tarj_actual3 <= 1 ? $('.btn-atras3').addClass('disabled') : $('.btn-atras3').removeClass('disabled');
  tarj_actual3 >= tarjetas3.length ? $('.btn-adelante3').addClass('disabled') : $('.btn-adelante3').removeClass('disabled');

  chk_fin_slider3();

}

function chk_atras3() {
  //if (wp.debugMode) console.log("🚀 ~ init_tarjetas3:")
  //if (wp.debugMode) console.log("🚀 ~ tarjetas3:", tarjetas3)
  if (wp.debugMode) console.log("🚀 ~ tarj_actual3:", tarj_actual3)

  for (i = 1; i <= tarjetas3.length; i++) {
	$(".panel3" + i).removeClass('animate__fadeIn');
	$(".panel3" + i).hide();
  }

  $(".panel3" + tarj_actual3).show().addClass('animate__fadeIn');
  $(".panel3" + tarj_actual3).focus();

  tarj_actual3 <= 1 ? $('.btn-atras3').addClass('disabled') : $('.btn-atras3').removeClass('disabled');
  tarj_actual3 >= tarjetas3.length ? $('.btn-adelante3').addClass('disabled') : $('.btn-adelante3').removeClass('disabled');

  chk_fin_slider3();

}

$('.btn-adelante3').on('click', function () {
  tarj_actual3 += 1;
  tarjetas3[tarj_actual3 - 1] = 1;
  chk_adelante3();
});

$('.btn-atras3').on('click', function () {
  tarj_actual3 -= 1;
  chk_atras3();
});

$(document).ready(function () {
  for (i = 1; i <= tarjetas3.length; i++) {
	$(".panel3" + i).hide();
  }
  $(".panel3" + tarj_actual3).show();
});

  $(function () {
	for (i = 1; i <= tarjetas3.length; i++) {
	  (function (i) {
		
		$(".panel3" + i).keydown(function (e) {
		  if (wp.debugMode) console.log("🚀 ~ i:", i)
		  var key = e.which;

			//&& tarj_actual3 < tarjetas3.length
		  if (key == 9)  // the enter key code
		  {
			//e.preventDefault();
			//window.open("descargas/infografia_spei.pdf", "_blank");
			//$('.btn-adelante3').click();

			//if (wp.debugMode) console.log("🚀 ~ key:", $('.btn-atras3').is(":disabled"))
			if (wp.debugMode) console.log("🚀 ~ e.shiftKey:", e.shiftKey)

			/* if (wp.debugMode) console.log("🚀 ~ tarj_actual3 <= 1:", tarj_actual3 <= 1)
			if (wp.debugMode) console.log("🚀 ~ tarj_actual3 >= tarjetas3.length :", tarj_actual3 >= tarjetas3.length )
			if (wp.debugMode) console.log("🚀 ~ tarj_actual3 :", tarj_actual3 )
			if (wp.debugMode) console.log("🚀 ~ tarjetas3.length :", tarjetas3.length ) */

			if (e.shiftKey) {

			  tarj_actual3 <= 1 ? $('.prev_from_slider3').focus() : $('.btn-atras3').click();
			}
			else {
			  tarj_actual3 >= tarjetas3.length ? $('.next_from_slider3').focus() : $('.btn-adelante3').click();
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
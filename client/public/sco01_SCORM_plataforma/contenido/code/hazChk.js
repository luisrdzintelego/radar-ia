function set_vars(num) {
	if (wp.debugMode) console.log("🔵 ~ set_vars: ")
	window.parent.setVariantes(chk, actual);
	//if (wp.debugMode) console.log('🔵 ~ GUARDA QUE SE COMPLETO UN NODO: ', chk, ' - ' , actual);
	chk_btns(num, 'avance');
}

function chk_nodo(num) {
	if (wp.debugMode) console.log("🔵 ~ ⭐chk_nodo: ", num)
	if (chk[num] == 0) {
		chk[num] = 1;
		set_vars(num);
	} else {
		chk_btns(num);
	}
}


function reiniciar() {
	if (wp.debugMode) console.log("🔵 ~ ⭐reiniciar: ⬇︎ ~~~~~~~~~~~~~~~~~~~ ")

	for (i = 1; i <= window.parent.paginas; i++) {

		if (wp.debugMode) console.log("🔵 ~ reiniciando pagina: ", i)
		//if (window.parent.setVariantes) {
			window.parent.setVariantes(0, i);
		//}

		//if (window.parent.setCalif2023) {
			window.parent.setCalif2023(i, 0, 0, 1);
		//}

	}

	window.parent.bookmark = '';
	window.parent.itentos = 0;
	window.parent.nombre = '';

	window.parent.set_reiniciarCurso();

	if (window.parent.tipo_curso === 'plataforma') {
		window.parent.sendPlatform('restart')
	} else {
		hazSeccion(1);
	}
	if (wp.debugMode) console.log("⬆︎ ~~~~~~~~~~~~~~~~~~~~")
}

//if (wp.debugMode) console.log("🚀 ~ atv:", atv.length)
function chk_btns(num, accion) {
	if (wp.debugMode) console.log("🔵 ~ ⭐chk_btns: ⬇︎ ~~~~~~~~~~~~~~~~~~~")
	if (wp.debugMode) console.log("🔵 ~ IDIOMA:" + window.parent.idioma);
	if (wp.debugMode) console.log("🔵 ~ num:", num, " ~ accion:", accion)


	if (wp.debugMode) console.log("%c 👻 ~ chk_btns:", styles.colors.purple_bd)

	if (num) {
		for (i = 1; i <= obj.length; i++) {
			if (num == i) {
				if (wp.debugMode) console.log("%c🚀 ~ OBJ:" + obj[i - 1] + " -- " + i + " -- " + chk[i], styles.colors.purple_bd)
			} else {
				if (chk[i] == 1) {
					if (wp.debugMode) console.log("%c🚀 ~ OBJ:" + obj[i - 1] + " -- " + i + " -- " + chk[i], styles.colors.green_sm)
				} else {
					//if (wp.debugMode) console.log("%c🚀 ~ OBJ:" + obj[i - 1] + " -- " + i + " -- " + chk[i], styles.colors.red_sm)
				}
			}
		}
	}

	//LOGICA PARA DAR POR COMPLETADA CADA SECCION
	Object.keys(objetoArrays).forEach((key, index) => {

		var ind = index + 1;
		//if (wp.debugMode) console.log("🚀 ~ index:", index)
		//if (wp.debugMode) console.log("🚀 ~ key:",key)
		//if (wp.debugMode) console.log("🚀 ~ objetoArrays[key]:",objetoArrays[key])

		var c = 0;
		for (i = 0; i < objetoArrays[key].length; i++) {
			//if (wp.debugMode) console.log('//', objetoArrays.obj)
			//if (wp.debugMode) console.log('//', objetoArrays.obj1[i], '---', chk[objetoArrays.obj1[i]], '---', chk[objetoArrays.obj1[i]] == 0)
			if (chk[objetoArrays[key][i]] == 0) {
				c++;
			}
		}
		//if (wp.debugMode) console.log("🚀 ~ c:", c)
		if (atv[ind] == 0) {
			c == 0 ? atv[ind] = 1 : atv[ind] = 0;
		}
	});

	if (wp.debugMode) console.log("🔵 ~ atv --- ", atv)

	for (i = 1; i <= atv.length; i++) {
		//atv[i] == 1 ? add_image_inDiv('atv' + i, '../sources/check.svg', '100%') : add_image_inDiv('atv' + i, '../sources/info.svg', '100%')

		atv[i] == 1 ? change_img_svg('atv' + i, '../../sources/check') : ''
	
		//atv[i] == 1 ? $('.atv' + i).html(`<img width="25" height="25" src='sources/ok.svg'>`) : $('.atv' + i).text('i')
		//atv[i] == 1 ? $('.atv' + i).html(`<img width="25" height="25" src='sources/check.svg'>`) : $('.atv' + i).html(`<img width="25" height="25" src='sources/info.svg'>`)
		atv[i] == 1 ? $('.atv' + i).addClass('animate animate__heartBeat') : ''
		//atv[i] == 1 ? $('.atv' + i).addClass('animate__heartBeat') : ''

	
	}

	//por ATV
	/* var n = 0;
	for (i = 1; i <= atv.length; i++) {
	  atv[i] == 0 ? n++ : ''
	}
	if (n === 0) {
	  $('.avanzar').addClass("parpadea");
	  hazVisto(actual)
	} */

	// por CHk
	var n = 0;
	var m = 0;
	for (i = 1; i <= obj.length; i++) {
		chk[i] == 0 ? n++ : ''
		chk[i] != 0 ? m++ : ''
	}

	if(actual == 3){
		//------------ Sec1
		
		if (chk[1] == 1 && chk[2] == 1 && chk[3] == 1 && chk[4] == 1) {
		$('.sec2').show();
		} else {
		$('.sec2').hide();
		}

		if (chk[5] == 1 && chk[6] == 1 && chk[7] == 1 && chk[8] == 1) {
		$('.preguntas').show();
		} else {
		$('.preguntas').hide();
		}

		if (chk[9] == 1) {
			$('.s-salida').show();
			$('.preguntas').hide();
		} 
	}

	if(actual == 4){
		//------------ Sec1
		
		if (chk[1] == 1) {
		$('.sec2').show();
		$('.sec3').show();
		} else {
		$('.sec2').hide();
		$('.sec3').hide();
		}

		if (chk[2] == 1) {
		$('.sec4').show();
		} else {
		$('.sec4').hide();
		}

		if (chk[3] == 1) {
		$('.sec5').show();
		} else {
		$('.sec5').hide();
		}

		if (chk[4] == 1 && chk[5] == 1 && chk[6] == 1 && chk[7] == 1 && chk[8] == 1 && chk[9] == 1 && chk[10] == 1 ) {
		$('.sec6').show();
		} else {
		$('.sec6').hide();
		}

		if (chk[11] == 1 && chk[12] == 1 && chk[13] == 1 ) {
			$('.preguntas').show();
		} else {
			$('.preguntas').hide();
		}

		if (chk[14] == 1) {
			$('.s-salida').show();
			$('.preguntas').hide();
		} 
	}

	if(actual == 5){
		//------------ Sec1

		if (wp.debugMode) console.log("🚀 ~ m:", m)
		
		if (chk[1] == 1) {
			$('.preguntas').show();
		} else {
			$('.preguntas').hide();
		}

		if (accion === 'inicio') {
			if (m <= 2) {
				PregActual = 1;
				mostrar_caso(PregActual);
			} 
		}

		if (chk[2] == 1) {
			$('.preguntas1').removeClass('disabled');
		} else {
			$('.preguntas1').addClass('disabled');
		}

		if (accion === 'inicio') {
			if (m >= 3 && m <= 4 ) {
				PregActual = 2;
				mostrar_caso(PregActual);
			} 
		}

		if (chk[4] == 1) {
			$('.preguntas2').removeClass('disabled');
		} else {
			$('.preguntas2').addClass('disabled');
		}

		if (accion === 'inicio') {
			if (m >= 5 && m <= 6 ) {
				PregActual = 3;
				mostrar_caso(PregActual);
			} 
		}

		if (chk[6] == 1) {
			$('.preguntas3').removeClass('disabled');
		} else {
			$('.preguntas3').addClass('disabled');
		}

		if (accion === 'inicio') {
			if (m >= 7 && m <= 8) {
				PregActual = 4;
				mostrar_caso(PregActual);
			} 
		}

		if (chk[8] == 1) {
			$('.preguntas4').removeClass('disabled');
		} else {
			$('.preguntas4').addClass('disabled');
		}

		if (accion === 'inicio') {
			if (m >= 9 && m <= 10 ) {
				PregActual = 5;
				mostrar_caso(PregActual);
			} 
		}

		if (chk[10] == 1) {
			$('.preguntas5').removeClass('disabled');
		} else {
			$('.preguntas5').addClass('disabled');
		}

		if (accion === 'inicio') {
			if (m >= 11 && m <= 12) {
				PregActual = 6;
				mostrar_caso(PregActual);
			} 
		}

		if (chk[12] == 1) {
			$('.preguntas6').removeClass('disabled');
		} else {
			$('.preguntas6').addClass('disabled');
		}


		if (accion === 'inicio') {
			if (m >= 13) {
				PregActual = 7;
				mostrar_caso(PregActual);
			} 
		}

		/* if (chk[13] == 1) {
			$('.s-salida').show();
			$('.preguntas').hide();
		}  */

	}


	if (wp.debugMode) console.log('🔵 ~ accion:::', accion, ' - ', accion === 'inicio');

	if (n === 0) {
		//if (wp.debugMode) console.log("🚀 ~ SE COMPLETO LA PAGINA:")
		$('.avanzar').addClass("parpadea");
		if (wp.debugMode) console.log('🔵 ~ GUARDA QUE SE COMPLETO LA PAGINA :', actual);
		hazVisto(actual)

		/* if (actual != 10) {
			if (wp.debugMode) console.log('🔵 ~ GUARDA QUE SE COMPLETO LA PAGINA :', actual);
			hazVisto(actual)
			//window.parent.set_Brilla();
		} else {
			if (wp.debugMode) console.log('🔵 ~ GUARDA QUE SE COMPLETO LA PAGINA CON EVALUACION:', actual);
			window.parent.setDone(actual, 3)
		} */

	} else {

		if (accion === 'avance') {
			if (wp.debugMode) console.log('🔵 ~ GUARDA QUE SE COMPLETO UN NODO: ', chk, ' - ', actual);
			window.parent.set_Brilla();
		} else if (accion === 'inicio') {
			if (wp.debugMode) console.log('🔵 ~ GUARDA EL LLEGAR A ESTA PAGINA');
			window.parent.set_Brilla();
		} else if (accion === 'eval') {
			if (wp.debugMode) console.log('🔵 ~ GUARDA CALIFICACION E INTENTOS DE LA EVALUACION');
			window.parent.set_Brilla();
		}
	}

	if (wp.debugMode) console.log("⬆︎ ~~~~~~~~~~~~~~~~~~~~")
}

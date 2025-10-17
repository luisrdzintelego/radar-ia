function getJSON(href) {
    var result;
    $.ajax({
        dataType: "json",
        url: href,
        //data: data,
        async: false,
        success: function (data) {
            //if (wp.debugMode) console.log("🚀 ~ data:", data)
            result = data;
        }
    });
    return result;
}

//obtener un objeto aleatoreo
const getRandom = (array) => {
    const randomObject = array[Math.floor(Math.random() * array.length)];
    return randomObject;
};
//revolver un array
const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
};


function shuffle_divs() {
    var container = document.getElementById("quiz-options");
    var elementsArray = Array.prototype.slice.call(container.getElementsByClassName('evaluation_answer-element'));
    elementsArray.forEach(function (element) {
        container.removeChild(element);
    })
    shuffleArray(elementsArray);
    elementsArray.forEach(function (element) {
        container.appendChild(element);
    })
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        //if (wp.debugMode) console.log("🚀 ~ temp:", temp)
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

let preguntas_eval = `code/evaluacion_final.json`;
//let preguntas_test = `code/test_final.json`;

//let wparent = window.parent.parent;
let wparent = window.parent;
var int = wparent.intentos;


// if (wp.debugMode) console.log("~ -------")
var bd_preguntas;
//var bd_preguntas_ale;
var totaPreguntas;
var respCorrecta;
var respUsuario;
var pregActual;
var puntaje;
var gameOver;
var aprobacion;

function initEval(href, num, pase) {

    if (wparent.getPageStatus(actual) === 3) {
        $('.evaluacion').hide();


        //muestra el ultimo resultado
        $('.result-porcentaje').html(`${wparent.getCalif(10)}`);
        $('.retro_bien').show();

        $('.retro_mal1').hide();
        $('.retro_mal2').hide();
        $('.retro_mal3').hide();
        
    } else {
        if (wparent.intentos >= 3) {

            if (wparent.getCalif(10) >= 80) {

                $('.evaluacion').hide();

                //muestra el ultimo resultado
                $('.result-porcentaje').html(`${wparent.getCalif(10)}`);
                $('.retro_bien').show();

                $('.retro_mal1').hide();
                $('.retro_mal2').hide();
                $('.retro_mal3').hide();

            } else {

                $('.evaluacion').hide();
                $('.retro_bien').hide();
                $('.retro_mal1').hide();
                $('.retro_mal2').hide();

                //muestra el ultimo resultado
                $('.result-porcentaje').html(`${wparent.getCalif(10)}`);
                $('.retro_mal3').show();

            }

        } else {

            if (wparent.getCalif(10) >= 80) {

                $('.evaluacion').hide();

                //muestra el ultimo resultado
                $('.result-porcentaje').html(`${wparent.getCalif(10)}`);
                $('.retro_bien').show();

                $('.retro_mal1').hide();
                $('.retro_mal2').hide();
                $('.retro_mal3').hide();

            } else {

                $('.evaluacion').show();
                $('.evaluacion').removeClass('disabled');
                //$('.preguntas').hide();
                //$('.preguntas').css('display', 'flex').show()
                $('.retro_bien').hide();
                $('.retro_mal1').hide();
                $('.retro_mal2').hide();
                $('.retro_mal3').hide();

                int++;
                bd_preguntas = shuffle(getJSON(href))
                // if (wp.debugMode) console.log("🚀 ~ bd_preguntas:", bd_preguntas)

                if (bd_preguntas.length >= num) {
                    totaPreguntas = num;
                } else {
                    totaPreguntas = bd_preguntas.length;
                }

                aprobacion = pase;

                // if (wp.debugMode) console.log("🚀 ~ totaPreguntas:", totaPreguntas)

                respCorrecta = 0;
                respUsuario = 0;
                pregActual = 0;
                puntaje = 0;

                gameOver = false;

                NextQuestion();

                if (int >= 2) {

                    $('html, body').stop().animate(
                        {
                            scrollTop: ($('.evaluacion').offset().top),
                        }, 600, function () {
                            // Animation complete.
                            //$('.preguntas').hide();
                        });

                }

            }




        }
    }
}

function noRepRandom(val) {
    var stor = [];
    var auth = true;
    var final_array = [];
    var i = 0;
    while (i < val) {
        var num = Math.floor(Math.random() * val) + 1;
        var j = 0;
        while (j < stor.length) {
            if (num == stor[j]) {
                auth = false;
                i--;
                break;
            } else {
                auth = true;
            }
            j++;
        }
        stor.push(num);
        if (auth == true) {
            final_array.push(num);
        }
        i++;
    }
    return final_array;
}

function noRepRandomArray(_array) {
    var final_array = [];
    for (var i = 0; i < _array.length; i++) {
        //if (wp.debugMode) console.log("_array.length:: " + _array.length);
        var num = Math.floor(Math.random() * _array.length) + 1;
        //if (wp.debugMode) console.log("num:: " + num);
        var _pop = _array.splice(num - 1, 1);
        //if (wp.debugMode) console.log("Guardar: " + _pop);
        final_array.push(_pop);
        i = -1;
    }

    return final_array;
}

var root = this;
var ranNum4 = ['A', 'B', 'C', 'D'];
var ranNum3 = ['A', 'B', 'C'];
var ranNum2 = ['A', 'B'];

function NextQuestion() {

    // var aleat = noRepRandom(3)

    $('.btn-enviar-eval-final').hide();

    $('.btn-sig').hide();
    $('.retro-bien').hide();
    $('.retro-mal').hide();
    $('.btn-reintenar').hide();
    //$('.retro_mal').hide()
    //$('.retro_bien').hide()

    $('.campo-conteo').html(`${pregActual + 1} / ${totaPreguntas}`);

    //update de la barra
    let progress = 100 * ((pregActual + 1) / totaPreguntas);
    $('.progress_bar').css('width', progress + '%');

    $('.resp').find('.answer_option-selector').removeClass('selected');
    //$('.resp').removeClass('selected');
    $('.resp').removeClass('deshabilitado')

    $(".ico-mal").hide();
    $(".ico-bien").hide();

    //$('.resp').find('.respuesta-opcion').removeClass('seleccionado');

    //respCorrecta = bd_preguntas[pregActual].correcta;
    respCorrecta = 1;

    if (wp.debugMode) console.log("🚀 ~ RepsCorrecta...:", bd_preguntas[pregActual].opcion_1)
    // if (wp.debugMode) console.log("🚀 ~ Tema...:", bd_preguntas[pregActual].tema)
    // if (wp.debugMode) console.log("🚀 ~ Tema.........................")
    $('.campo-pregunta').html(`${bd_preguntas[pregActual].pregunta}`);
    //$('.campo-pregActual').html(`${pregActual+1}`);

    $('.campo-resp1').html(`${bd_preguntas[pregActual].opcion_1}`);
    $('.campo-resp2').html(`${bd_preguntas[pregActual].opcion_2}`);
    /* $('.campo-resp3').html(`${bd_preguntas[pregActual].opcion_3}`); */
    //$('.campo-resp4').html(`${bd_preguntas[pregActual].opcion_4}`);

    /* if (bd_preguntas[pregActual].opcion_3 == undefined || bd_preguntas[pregActual].opcion_3 == null || bd_preguntas[pregActual].opcion_3 == '') {
        $(`.resp[data-resp*='3']`).hide();
    } else {
        $(`.resp[data-resp*='3']`).show();
        $('.campo-resp3').html(`${bd_preguntas[pregActual].opcion_3}`);
    } */

    shuffle_divs();

    if (bd_preguntas[pregActual].opcion_3 == undefined || bd_preguntas[pregActual].opcion_3 == null || bd_preguntas[pregActual].opcion_3 == '') {

        $(`.resp[data-resp*='3']`).hide();

        $(".respuesta-opcion:visible").each(function (index) {
            //if (wp.debugMode) console.log("🚀 ~ index:", index)
            $(this).text(ranNum2[index])
        });

    } else {

        $(`.resp[data-resp*='3']`).show();

        $('.campo-resp3').html(`${bd_preguntas[pregActual].opcion_3}`);

        $(".respuesta-opcion:visible").each(function (index) {
            //if (wp.debugMode) console.log("🚀 ~ index:", index)
            $(this).text(ranNum3[index])
        });

    }

    //document.getElementById('retro').innerHTML = bd_preguntas[pregActual].retro;
}

//EVALUACION --selecciona respuesta
$('.resp').on('click', function (event) {
    var act = $(this).attr('data-resp');
    if (wp.debugMode) console.log("🚀 ~", act);
    respUsuario = act;

    //$('.resp').removeClass('selected');
    $('.resp').find('.answer_option-selector').removeClass('selected');
    //$('.resp').removeClass('selected');

    //$(this).addClass('selected')
    $(this).find('.answer_option-selector').addClass('selected')
    //$(this).addClass('selected');

    //$('.btn-enviar').show();
    $('.btn-enviar-eval-final').show();

});

$(".resp").mouseover(function () {
    //if (wp.debugMode) console.log("🚀 ~ mouseover:")
    //$(this).find('.respuesta-opcion').addClass('selected');

});

$(".resp").mouseout(function () {
    //if (wp.debugMode) console.log("🚀 ~ mouseout:")
    //$(this).find('.respuesta-opcion').removeClass('selected');
});


//EVALUACION -- envia respuesta evaluacion reforzamiento
$('.btn-enviar-eval-final').on('click', function () {
    if (wp.debugMode) console.log("🎃 ~ btn-enviar-eval-final:")

    $(this).hide()
    // if (wp.debugMode) console.log("🚀 ~ respCorrecta == num:", respCorrecta, " -- ", respUsuario, respCorrecta == respUsuario)
    if (wp.debugMode) console.log("🚀 ~ respCorrecta == respUsuario:", respCorrecta == respUsuario)

    if (respCorrecta == respUsuario) {

        puntaje++;
        //$(`[data-resp=${respUsuario}]`).addClass('ok')
        $(`[data-resp=${respUsuario}]`).find(".ico-mal").hide();
        $(`[data-resp=${respUsuario}]`).find(".ico-bien").show().addClass('animate__zoomIn');

        //QUITAR RETRO
        //$('.retro-bien').show();
        //$('.text-retro').text(bd_preguntas[pregActual].retro);
    } else {

        $(`[data-resp=${respUsuario}]`).find(".ico-bien").hide();
        $(`[data-resp=${respUsuario}]`).find(".ico-mal").show().addClass('animate__zoomIn');

        //PARA PONER LA RESPUESTA CORRECTA
        //$(`[data-resp=${respCorrecta}]`).find(".option_circle").show().find(".is--x").hide();
        //$(`[data-resp=${respCorrecta}]`).find(".option_circle").show().find(".is--check").show().addClass('animate__zoomIn');

        //QUITAR RETRO
        //$('.retro-mal').show();
        //$('.text-retro').text(bd_preguntas[pregActual].retro);
        //document.getElementById('retro').innerHTML = "Recuerda: " + bd_preguntas[pregActual].retro;
    }

    $('.campo-pregunta').html(`${bd_preguntas[pregActual].pregunta}`);
    $('.campo-resp1').html(`${bd_preguntas[pregActual].opcion_1}`);
    $('.campo-resp2').html(`${bd_preguntas[pregActual].opcion_2}`);
    $('.campo-resp3').html(`${bd_preguntas[pregActual].opcion_3}`);

    $(".btn-sig").show()
    $(".campo-retro").focus();

    $('.resp').addClass('deshabilitado')

    let progress = Math.round(100 * ((pregActual + 1) / totaPreguntas));
    if (wp.debugMode) console.log("🚀 ~ progress:", progress)
    if (progress == 100) { gameOver = true; }

    /* $('html, body').stop().animate(
        {
            scrollTop: ($('.retro').offset().top),
        }, 600, function () {
            // Animation complete.
            //$('.btn-iniciar-eval').addClass('disabled');
            setTimeout(() => {
                hazVisto(actual)       
            }, 3000);
        }); */

});

//EVALUACION --siguiente pregunta
$('.btn-sig').on('click', function (event) {

    if (wp.debugMode) console.log("🚀 ~ gameOver:", gameOver)

    if (gameOver == false) {

        pregActual++;
        NextQuestion();

        $('html, body').stop().animate(
            {
                scrollTop: ($('.campo-pregunta').offset().top - 150),
            }, 600, function () {
                // Animation complete.
            });


    } else {

        //$('.retros').css('display', 'flex').show();

        //$('.puntaje').html(`${puntaje}`);
        $('.campo-aciertos').html(`${puntaje}`);
        $('.campo-total').html(`${totaPreguntas}`);


        let result = Math.round(100 * (puntaje / totaPreguntas));
        if (wp.debugMode) console.log("🚀 ~ result:", result)
        $('.result-porcentaje').html(`${result}`);

        //if (wp.debugMode) console.log("🚀 ------------ ", $('.btn-curso').closest(".cursos_ext").attr('num') )
        //if (wp.debugMode) console.log("🚀 ------------ ", $('.btn-curso').closest(".cursos_ext").attr('num') == window.parent.actual )

        //$('.campo-intentos').html(`${int}`);
        //let errores = totaPreguntas -  puntaje;
        //$('.campo-errores').html(`${errores}`);
        //$('.seccion_resultados').css("display", "block");

        if (wp.debugMode) console.log("*********************");
        if (wp.debugMode) console.log("🚀 ~ puntaje:", puntaje)
        //if (wp.debugMode) console.log("🚀 ~ rol_actual:", rol_actual)
        if (wp.debugMode) console.log("*********************");

        //if (wp.debugMode) console.log("🚀 ~ int:", wparent.intentos)
        if (wp.debugMode) console.log("🚀 ~ int:", int)

        if (wp.debugMode) console.log("🚀 ~ puntaje:", puntaje)
        if (wp.debugMode) console.log("🚀 ~ aprobacion:", aprobacion)
        if (wp.debugMode) console.log("🚀 ~ puntaje < aprobacion:", puntaje < aprobacion)

        // guarda el porcentaje en el LMS        
        if (window.parent) {
            var calif_antes = window.parent.getCalif(10);
            //window.parent.setCalif2023(10, result, int);
            if (wp.debugMode) console.log("CALIF: ANTES(" + calif_antes + ") > AHORA(" + result + ")")
            if (result > calif_antes) {
                window.parent.saveGrade(result);
                window.parent.intentos = int;
                // aumenta el intento en el json
                window.parent.setCalif2023(10, result, int);
            } else {
                window.parent.saveGrade(calif_antes);
                window.parent.intentos = int;
                // aumenta el intento en el json
                window.parent.setCalif2023(10, calif_antes, int);
            }
        }

        if (puntaje < aprobacion) {

            chk_btns('', 'eval');

            if (int == 1) {

                $('.retro_mal1').css('display', 'flex').show();

                $('html, body').stop().animate(
                    {
                        scrollTop: ($('.retro_mal1').offset().top),
                    }, 600, function () {
                        // Animation complete.
                        $('.evaluacion').addClass('disabled');
                    });

                /* $('.campo-retro').html('<b>Retro Mal 1!</b><br>').show(); */
                //$('.btn-reintenar').show();

            } else if (int == 2) {
                $('.retro_mal2').css('display', 'flex').show();
                /* $('.campo-retro').html('<b>Retro Mal 2!</b><br>').show(); */
                //$('.btn-reintenar').show();

                $('html, body').stop().animate(
                    {
                        scrollTop: ($('.retro_mal2').offset().top),
                    }, 600, function () {
                        // Animation complete.
                        $('.evaluacion').addClass('disabled');
                    });


            } else if (int == 3) {
                $('.retro_mal3').css('display', 'flex').show();
                /* $('.campo-retro').html('<b>Retro Mal 3!</b><br>').show(); */

                $('html, body').stop().animate(
                    {
                        scrollTop: ($('.retro_mal3').offset().top),
                    }, 600, function () {
                        // Animation complete.
                        $('.evaluacion').addClass('disabled');
                    });

            }

        } else {

            //hazVisto(actual);
            //window.parent.saveStatus("completed");
            //window.parent.saveStatus("passed");

            chk_nodo(1);
            //window.parent.saveGrade(result);
            $('.retro_bien').css('display', 'flex').show();

            $('html, body').stop().animate(
                {
                    scrollTop: ($('.retro_bien').offset().top),
                }, 600, function () {
                    // Animation complete.
                    $('.evaluacion').addClass('disabled');
                });

            //$('.campo-retro').html('<b>¡Excelente trabajo!</b><br>').show();
        }
    }
});



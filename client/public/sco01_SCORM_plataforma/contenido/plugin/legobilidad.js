// Variables para manejo de texto
var num_increase_text = 0;
var max_increase_text = 4;
var min_increase_text = 0;
// Variables para manejo de lineHeight
var num_increase_lineheight = 0;
var max_increase_lineheight = 4;
var min_increase_lineheight = 0;
// Variables para manejo de word spacing
var num_increase_wordspacing = 0;
var max_increase_wordspacing = 10;
var min_increase_wordspacing = 0;
// Arreglos de fuente, lineheight, wordspacing
var fonts_array = [];
var lineheight_array = [];
var wordspacing_array = [];
//
var what_font = "";
var what_lineheight = "";
var what_wordspacing = "";
// variables para el cambio de color

//var json_local = {};
// se crea la clase json_local
class JsonLocal{
    constructor() {
        /*console.log("LOCALSTORAGE: " , window.localStorage);
        if(window.localStorage != null && window.localStorage != ''){
            this.json_local = window.localStorage;
        }else{
            this.json_local = {};
        }*/
        console.log("SESSION_STORAGE: " , window.sessionStorage);
        if(window.sessionStorage != null && window.sessionStorage != ''){
            this.json_local = window.sessionStorage;
        }else{
            this.json_local = {};
        }
    }
    // addProp
    addProp(variable){
        console.log("EXISTE " + variable + ":: ", this.json_local[variable])
        if(this.json_local[variable] == undefined){          
            //localStorage.setItem(variable, '');
            sessionStorage.setItem(variable, '');
        }    
    }
    // Getter
    getProp(variable) {
        return this.json_local[variable];
    }
    // setter
    setProp(variable, args){  
        if(this.json_local[variable] == undefined){          
            //localStorage.setItem(variable, args);
            sessionStorage.setItem(variable, args);
        }      
        this.json_local[variable] = args;
    }
}
var json_; // = new JsonLocal();


function stringToColour(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}

function init() {
    console.log("INIT:::")
    // recoge los datos almacenados de localstorage
    json_ = new JsonLocal();

    // agrega las variables correspondientes
    json_.addProp("num_increase_text");
    json_.addProp("num_increase_lineheight");
    json_.addProp("num_increase_wordspacing");
    json_.addProp("deleteimages");
    json_.addProp("monocromo");
    json_.addProp("blackcontrast");
    json_.addProp("whitecontrast");
    json_.addProp("zoom");    
    json_.addProp("--intelego-customback");
    json_.addProp("--intelego-customfont");

    // actualiza valores
    //if()    
    console.log("----ACTUALIZA VARIABLES----");
    if(json_.getProp("num_increase_text") == ''){
        num_increase_text = 0;    
    }else{
        num_increase_text = parseInt(json_.getProp("num_increase_text"));        
    }
    console.log("num_increase_text::: " + num_increase_text)

    if(json_.getProp("num_increase_lineheight") == ''){
        num_increase_lineheight = 0;    
    }else{
        num_increase_lineheight = parseInt(json_.getProp("num_increase_lineheight"));
    }
    console.log("num_increase_lineheight::: " + num_increase_lineheight)
    
    if(json_.getProp("num_increase_wordspacing") == ''){
        num_increase_wordspacing = 0;    
    }else{
        num_increase_wordspacing = parseInt(json_.getProp("num_increase_wordspacing"));
    }
    console.log("num_increase_wordspacing::: " + num_increase_wordspacing)
    
    if(json_.getProp("zoom") == ''){
        zoom = 0;    
    }else{
        zoom = parseInt(json_.getProp("zoom"));
    }
    console.log("zoom::: " + zoom)

    // inicializa variables
    doVariables('body');

    // actualiza datos+
    setTimeout(function(){
        console.log("-----EJECUTA FUNCIONES-----")
        if(num_increase_text>=1){
            //num_increase_text--;
            //doTextPlus();

            doTextChange();
        }
        if(num_increase_lineheight>=1){
            //num_increase_lineheight--;
            //doLineHeightPlus();

            doLineHeightChange();
        }
        if(num_increase_wordspacing>=1){
            //num_increase_wordspacing--;
            //doWordSpacingPlus();

            doWordSpacingChange();
        }
        if(json_.getProp("deleteimages")=='true'){        
            doDeleteImages();
        }
        if(json_.getProp("monocromo")=='true'){
            doMonocromo();
        }
        if(json_.getProp("blackcontrast")=='true'){
            doBlackContrast();
        }
        if(json_.getProp("whitecontrast")=='true'){
            doWhiteContrast();
        }
        // ZOOM
        if(zoom>=1){
            updtZoom(zoom);
        }

        console.log("CUSTOMFONT::: " + json_.getProp("--intelego-customfont"))
        console.log("CUSTOMBLACK::: " + json_.getProp("--intelego-customback"))
        if(json_.getProp("--intelego-customback")!=undefined && json_.getProp("--intelego-customback")!='undefined' && json_.getProp("--intelego-customback")!='' && json_.getProp("--intelego-customback")!='#000000'){
            //$("#div_legobilidad #color-fondo").dispatchEvent("doChangeColorBackground");
            $("#div_legobilidad #color-fondo").val(json_.getProp("--intelego-customback"))
            $("#div_legobilidad #color-fondo").change();
        }
        if(json_.getProp("--intelego-customfont")!=undefined && json_.getProp("--intelego-customfont")!='undefined' && json_.getProp("--intelego-customfont")!='' && json_.getProp("--intelego-customfont")!='#000000'){
            //
            //doChangeColorText(json_.getProp("--intelego-customfont"));
            $("#div_legobilidad #color-texto").val(json_.getProp("--intelego-customfont"))
            $("#div_legobilidad #color-texto").change();
        }

    },500);
    
}
///////////////////// FONT --------------
        ////////////////////////////////////////
        /// AJUSTAR TAMAÑO de TEXTO
        ////////////////////////////////////////
function doTextPlus() {
    if (num_increase_text < max_increase_text) {        
        //console.log("TERMINO MAS " + num_increase_text)
        num_increase_text++;       
    } else {
        //console.log("TE pasaste!!!")
        num_increase_text = max_increase_text;       
    }
    //doTextUp();
    doTextChange();

    json_.setProp("num_increase_text", num_increase_text);
    console.log("++AUMENTO:: " + num_increase_text)
}
function doTextMinus() {
    if (num_increase_text > min_increase_text) {        
        //console.log("TERMINO MENOS")
        num_increase_text--;        
    } else {
        num_increase_text = min_increase_text;
    }
    //doTextDown();
    doTextChange();

    json_.setProp("num_increase_text", num_increase_text);
    console.log("--AUMENTO:: " + num_increase_text)
}
function doTextChange() {    
    // se recorre el array de tipografias
    for (var i = 0; i < fonts_array.length; i++) {
        var item = fonts_array[i].name;
        var aumentar_ = (fonts_array[i].tam_ini / max_increase_text);
        var nuevo_tamano_ = fonts_array[i].tam_ini + (num_increase_text * aumentar_);
        console.log(fonts_array[i].tam_ini + " aumentar A:: " + nuevo_tamano_)        
        $(":root").get(0).style.setProperty(item, (nuevo_tamano_) + "px");
    }
}
/*
function doTextUp() {    
    // se recorre el array de tipografias
    for (var i = 0; i < fonts_array.length; i++) {
        var item = fonts_array[i].name;
        //console.log(getComputedStyle($(":root").get(0)).getPropertyValue(item))
        var currentfont = parseFloat(getComputedStyle($(":root").get(0)).getPropertyValue(item));
        //console.log(currentfont + " aumenta a " + currentfont + " + "+(currentfont*(0.2)))  
        //$(item).css("font-size", (currentfont+aumentar)+"px");
        var aumentar_ = (fonts_array[i].tam_ini / max_increase_text);
        var nuevo_tamano_ = fonts_array[i].tam_ini + (num_increase_text * aumentar_);
        console.log(fonts_array[i].tam_ini + " aumentar A:: " + nuevo_tamano_)
        //$(":root").get(0).style.setProperty(item, (currentfont + aumentar_) + "px");
        $(":root").get(0).style.setProperty(item, (nuevo_tamano_) + "px");
    }
    //console.log("FIN MAS")
}
function doTextDown() {
    // se recorre el array de tipografias   
    for (var i = 0; i < fonts_array.length; i++) {
        var item = fonts_array[i].name;
        //console.log(getComputedStyle($(":root").get(0)).getPropertyValue(item))
        var currentfont = parseFloat(getComputedStyle($(":root").get(0)).getPropertyValue(item));
        //console.log(currentfont + " aumenta a " + currentfont + " + "+(currentfont*(0.2)))  
        //var aumentar_ = (fonts_array[i].tam_ini / max_increase_text);
        var aumentar_ = (fonts_array[i].tam_ini / max_increase_text);
        var nuevo_tamano_ = fonts_array[i].tam_ini + (num_increase_text * aumentar_);
        console.log(fonts_array[i].tam_ini + " disminuir A:: " + nuevo_tamano_)
        $(":root").get(0).style.setProperty(item, (nuevo_tamano_) + "px");
    }
    //console.log("FIN MENOS")
}
*/
function checkFont(item) {
    return item.name == what_font;
}
///////////////////// LINEHEIGHT --------------
        ////////////////////////////////////////
        /// AJUSTAR TAMAÑO de ESPACIOS ENTRE RENGLONES DE TEXTO
        ////////////////////////////////////////
function doLineHeightPlus() {
    if (num_increase_lineheight < max_increase_lineheight) {        
        num_increase_lineheight++;
    } else {
        num_increase_lineheight = max_increase_lineheight;
    }
    //doLineHeightUp();
    doLineHeightChange();

    json_.setProp("num_increase_lineheight", num_increase_lineheight);
    console.log("++AUMENTO LINEHEIGHT:: " + num_increase_lineheight)
}
function doLineHeightMinus() {
    if (num_increase_lineheight > min_increase_lineheight) {        
        num_increase_lineheight--;
    } else {
        num_increase_lineheight = min_increase_lineheight;
    }
    //doLineHeightDown();
    doLineHeightChange();

    json_.setProp("num_increase_lineheight", num_increase_lineheight);
    console.log("--AUMENTO LINEHEIGHT:: " + num_increase_lineheight)
}
function doLineHeightChange() {
    // se recorre el array de lineheight
    for (var i = 0; i < lineheight_array.length; i++) {
        var item = lineheight_array[i].name;
        var aumentar_ = (lineheight_array[i].tam_ini / max_increase_lineheight);
        var nuevo_tamano_ = lineheight_array[i].tam_ini + (num_increase_lineheight * aumentar_);
        console.log(lineheight_array[i].tam_ini + " aumentar A:: " + nuevo_tamano_)        
        $(":root").get(0).style.setProperty(item, (nuevo_tamano_) + "px");
    }
}
/*
function doLineHeightUp() {
    // se recorre el array de lineheight
    for (var i = 0; i < lineheight_array.length; i++) {
        var item = lineheight_array[i].name;
        var currentlineheight = parseFloat(getComputedStyle($(":root").get(0)).getPropertyValue(item));
        //var aumentar_ = (lineheight_array[i].tam_ini / max_increase_lineheight);

        var aumentar_ = (lineheight_array[i].tam_ini / max_increase_lineheight);
        var nuevo_tamano_ = lineheight_array[i].tam_ini + (num_increase_lineheight * aumentar_);
        console.log(lineheight_array[i].tam_ini + " aumentar A:: " + nuevo_tamano_)

        //$(":root").get(0).style.setProperty(item, (currentlineheight + aumentar_) + "px");
        $(":root").get(0).style.setProperty(item, (nuevo_tamano_) + "px");
    }
    //console.log("FIN MAS")
}
function doLineHeightDown() {
    // se recorre el array de lineheight
    for (var i = 0; i < lineheight_array.length; i++) {
        var item = lineheight_array[i].name;
        var currentlineheight = parseFloat(getComputedStyle($(":root").get(0)).getPropertyValue(item));
        //var aumentar_ = (lineheight_array[i].tam_ini / max_increase_lineheight);

        var aumentar_ = (lineheight_array[i].tam_ini / max_increase_lineheight);
        var nuevo_tamano_ = lineheight_array[i].tam_ini + (num_increase_lineheight * aumentar_);
        console.log(lineheight_array[i].tam_ini + " disminuir A:: " + nuevo_tamano_)

        //$(":root").get(0).style.setProperty(item, (currentlineheight - aumentar_) + "px");
        $(":root").get(0).style.setProperty(item, (nuevo_tamano_) + "px");
    }
    //console.log("FIN MENOS")
}
*/
function checkLineHeight(item) {
    return item.name == what_lineheight;
}
///////////////////// WORD SPACING --------------
        ////////////////////////////////////////
        /// AJUSTAR TAMAÑO de ESPACIO ENTRE PALABRAS
        ////////////////////////////////////////
function doWordSpacingPlus() {
    if (num_increase_wordspacing < max_increase_wordspacing) {        
        num_increase_wordspacing++;
    } else {
        num_increase_wordspacing = max_increase_wordspacing;
    }
    //doWordSpacingUp();
    doWordSpacingChange();

    json_.setProp("num_increase_wordspacing", num_increase_wordspacing);
    console.log("++AUMENTO WordSpacing:: " + num_increase_wordspacing)
}
function doWordSpacingMinus() {
    if (num_increase_wordspacing > min_increase_wordspacing) {        
        num_increase_wordspacing--;
    } else {
        num_increase_wordspacing = min_increase_wordspacing;
    }
    //doWordSpacingDown();
    doWordSpacingChange();

    json_.setProp("num_increase_wordspacing", num_increase_wordspacing);
    console.log("--AUMENTO WordSpacing:: " + num_increase_wordspacing)
}
function doWordSpacingChange() {
    // se recorre el array de wordspacing
    for (var i = 0; i < wordspacing_array.length; i++) {
        var item = wordspacing_array[i].name;
        var aumentar_ = 1;
        var nuevo_tamano_ = wordspacing_array[i].tam_ini + (num_increase_wordspacing * aumentar_);
        console.log(wordspacing_array[i].tam_ini + " aumentar A:: " + nuevo_tamano_)        
        $(":root").get(0).style.setProperty(item, (nuevo_tamano_) + "px");
    }
}
/*
function doWordSpacingUp() {
    // se recorre el array de wordspacing
    for (var i = 0; i < wordspacing_array.length; i++) {
        var item = wordspacing_array[i].name;
        //var currentwordspacing = parseFloat(getComputedStyle($(":root").get(0)).getPropertyValue(item));
        //var aumentar_ = 1; //(wordspacing_array[i].tam_ini/max_increase_wordspacing);
        //console.log(item + " :: " + (currentwordspacing + aumentar_) + "px")
        //console.log(wordspacing_array[i].tam_ini +" / " + max_increase_wordspacing)
        var aumentar_ = 1; //(wordspacing_array[i].tam_ini / max_increase_wordspacing);
        //console.log("aumentar: " + aumentar_)
        var nuevo_tamano_ = wordspacing_array[i].tam_ini + (num_increase_wordspacing * aumentar_);
        console.log(wordspacing_array[i].tam_ini + " aumentar A:: " + nuevo_tamano_)

        //$(":root").get(0).style.setProperty(item, (currentwordspacing + aumentar_) + "px");
        $(":root").get(0).style.setProperty(item, (nuevo_tamano_) + "px");
    }
    //console.log("FIN MAS")
}
function doWordSpacingDown() {
    // se recorre el array de wordspacing
    for (var i = 0; i < wordspacing_array.length; i++) {
        var item = wordspacing_array[i].name;
        var currentwordspacing = parseFloat(getComputedStyle($(":root").get(0)).getPropertyValue(item));
        //var aumentar_ = 1; //(wordspacing_array[i].tam_ini/max_increase_wordspacing);

        var aumentar_ = 1; //(wordspacing_array[i].tam_ini / max_increase_wordspacing);
        //console.log("aumentar: " + aumentar_)
        var nuevo_tamano_ = wordspacing_array[i].tam_ini + (num_increase_wordspacing * aumentar_);
        console.log(wordspacing_array[i].tam_ini + " disminuir A:: " + nuevo_tamano_)

        //$(":root").get(0).style.setProperty(item, (currentwordspacing - aumentar_) + "px");
        $(":root").get(0).style.setProperty(item, (nuevo_tamano_) + "px");
    }
    //console.log("FIN MENOS")
}
*/
function checkWordSpacing(item) {
    return item.name == what_wordspacing;
}

///////////////////// GENERALES --------------
function chekNodo(array, item, propertie) {
    var currentprop = parseFloat($(item).css(propertie));
    var currentpropstring = $(item).css(propertie);
    //console.log("MENOS currentfont CON HIJOS::: " + currentfont)
    var prop_ = "--intelego-" + propertie + "-" + currentpropstring.split(".").join("_");
    //console.log(font_)
    $(item).css(propertie, "var(" + prop_ + ", " + currentprop + "px)");

    var isexist = null;
    switch (propertie) {
        case "font-size":
            what_font = prop_;
            isexist = array.find(checkFont);
            break;
        case "line-height":
            what_lineheight = prop_;
            isexist = array.find(checkLineHeight);
            break;
        case "word-spacing":
            what_wordspacing = prop_;
            isexist = array.find(checkWordSpacing);
            break;
    }
    //what_font = font_;
    if (isexist == undefined) {
        array.push({ "name": prop_, "tam_ini": currentprop })
        var nodo_ = prop_;
        var value_ = currentprop + "px";
        //console.log("GUARDAR:: " + nodo_ + " = " + value_)
        $(":root").get(0).style.setProperty(nodo_, value_);
    }
}
// Funcion que inicia las variables CSS
function doVariables(args) {
    //console.log(args + ":::::")

    var cuerpo = $(args);
    for (var i = 0; i < cuerpo[0].children.length; i++) {
        var exepcion1 = cuerpo[0].children[i].nodeName != "SCRIPT";
        var exepcion2 = $(cuerpo[0].children[i]).hasClass("pestana_accesibilidad") == false;
        //console.log($(cuerpo[0].children[i]).hasClass("pestana_accesibilidad"))
        if (exepcion1 && exepcion2) {
            var item = cuerpo[0].children[i];
            // si tiene mas nodos dentro
            if ($(item).children().length > 0) {

                /////////////// CHECA LA TIPOGRAFIA --------------------
                chekNodo(fonts_array, item, "font-size");

                /////////////// CHECA LINE HEIGHT --------------------
                chekNodo(lineheight_array, item, "line-height");

                /////////////// CHECA WORD SPACING --------------------
                chekNodo(wordspacing_array, item, "word-spacing");

                doVariables(item)
            } else {

                /////////////// CHECA LA TIPOGRAFIA --------------------
                chekNodo(fonts_array, item, "font-size");

                /////////////// CHECA LINE HEIGHT --------------------
                chekNodo(lineheight_array, item, "line-height");

                /////////////// CHECA WORD SPACING --------------------
                chekNodo(wordspacing_array, item, "word-spacing");

            }
        }
    }
    //console.log("FIN VARIABLES")
}
////////////////// Funciones COLOR -----------------------------
// Función que hace grises los elementos
function doMonocromo() {
    // quita contraste Oscuro
    removeBlackContrast();
    // quita contraste claro
    removeWhiteContrast();  

    if ($("html").hasClass("grises") == false) {
        $("html").addClass("grises");
        json_.setProp("monocromo", true);

        // ver check
        $("#check_monocromo").removeClass("hidePanel");
    } else {    
        removeMonocromo();
    }
}
function doBlackContrast(){
    // quita ajustes personalizados de textos y fondo
    doReset();
    // quita escala de grises
    removeMonocromo();
    // quita contraste claro
    removeWhiteContrast();

    // checa si existe la clase en los elementos
    if ($("*:not(img):not(svg):not(path):not(video):not(.video-js *):not(#div_legobilidad, #div_legobilidad *)").hasClass("blackcontrast") == false) {
        $("*:not(img):not(svg):not(path):not(video):not(.video-js *):not(#div_legobilidad, #div_legobilidad *)").addClass("blackcontrast");        
        $("h6 [role='heading'], *:not(img):not(svg):not(path):not(video):not(.video-js *):not(#div_legobilidad, #div_legobilidad *)").addClass("yellowcontrast"); 
        json_.setProp("blackcontrast", true);

        // ver check
        $("#check_cblack").removeClass("hidePanel");
    } else {    
        removeBlackContrast();
    }
}
function doWhiteContrast(){
    // quita ajustes personalizados de textos y fondo
    doReset();
    // quita escala de grises
    removeMonocromo();
    // quita contraste Oscuro
    removeBlackContrast();

    // checa si existe la clase en los elementos
    if ($("*:not(img):not(svg):not(path):not(video):not(.video-js *):not(#div_legobilidad, #div_legobilidad *)").hasClass("whitecontrast") == false) {
        $("*:not(img):not(svg):not(path):not(video):not(.video-js *):not(#div_legobilidad, #div_legobilidad *)").addClass("whitecontrast");     
        json_.setProp("whitecontrast", true);  
        
        // ver check
        $("#check_cwhite").removeClass("hidePanel");
    } else {    
        removeWhiteContrast();
    }
}
function removeMonocromo(){
    $("html").removeClass("grises");
    json_.setProp("monocromo", false);

    // ver check
    $("#check_monocromo").addClass("hidePanel");
}
function removeWhiteContrast(){
    // quita contraste claro
    $("*:not(img):not(svg):not(path):not(video):not(.video-js *):not(#div_legobilidad, #div_legobilidad *)").removeClass("whitecontrast");
    json_.setProp("whitecontrast", false);

    // quitar check
    $("#check_cwhite").addClass("hidePanel");
}
function removeBlackContrast(){
    // quita contraste Oscuro
    $("*:not(img):not(svg):not(path):not(video):not(.video-js *):not(#div_legobilidad, #div_legobilidad *)").removeClass("blackcontrast");
    $("h6 [role='heading'], *:not(img):not(svg):not(path):not(video):not(.video-js *):not(#div_legobilidad, #div_legobilidad *)").removeClass("yellowcontrast");
    json_.setProp("blackcontrast", false);

    // quitar check
    $("#check_cblack").addClass("hidePanel");
}
function removeTagDeleteImages(){
    $("img:not(#div_legobilidad, #div_legobilidad *)").removeClass("deleteimages");
    $("svg:not(#div_legobilidad, #div_legobilidad *)").removeClass("deleteimages");
    $("*:not(img):not(video):not(#div_legobilidad, #div_legobilidad *)").removeClass("deleteimagesDiv"); 
    json_.setProp("deleteimages", false);

    // quitar check
    $("#check_images").addClass("hidePanel");
}
function doDeleteImages(){
    // checa si existe la clase en los elementos
    console.log("QuitaImages::")
    if ($("img:not(#div_legobilidad, #div_legobilidad *)").hasClass("deleteimages") == false) {
        $("img:not(#div_legobilidad, #div_legobilidad *)").addClass("deleteimages");        
        $("svg:not(#div_legobilidad, #div_legobilidad *)").addClass("deleteimages");   
        $("*:not(img):not(video):not(#div_legobilidad, #div_legobilidad *)").addClass("deleteimagesDiv"); 
        json_.setProp("deleteimages", true); 

        // ver check
        $("#check_images").removeClass("hidePanel");
    } else {    
        removeTagDeleteImages();
    }
}
function updtZoom(zoom_) {
    console.log("ZOOOOOOOOM:: " + zoom_)

    // quitar checks
    $("#check_zoom1").addClass("hidePanel");    
    $("#check_zoom2").addClass("hidePanel");    
    $("#check_zoom3").addClass("hidePanel");

    if(zoom_==0){
        $("html:not(#div_legobilidad) body>:not(#div_legobilidad)").css({ zoom: 1 })
        json_.setProp("zoom", 0);        
    }
    if(zoom_==1){
        if($("html:not(#div_legobilidad) body>:not(#div_legobilidad)").css('zoom')!=1.1){
            $("html:not(#div_legobilidad) body>:not(#div_legobilidad)").css({ zoom: 1.1 })
            json_.setProp("zoom", zoom_);

            // ver check
            $("#check_zoom1").removeClass("hidePanel");
        }else{
            $("html:not(#div_legobilidad) body>:not(#div_legobilidad)").css({ zoom: 1 })
            json_.setProp("zoom", 0);
        }          
    }
    if(zoom_==2){
        if($("html:not(#div_legobilidad) body>:not(#div_legobilidad)").css('zoom')!=1.2){
            $("html:not(#div_legobilidad) body>:not(#div_legobilidad)").css({ zoom: 1.2 })
            json_.setProp("zoom", zoom_);

            // ver check
            $("#check_zoom2").removeClass("hidePanel");
        }else{
            $("html:not(#div_legobilidad) body>:not(#div_legobilidad)").css({ zoom: 1 })
            json_.setProp("zoom", 0);
        }
    }
    if(zoom_==3){
        if($("html:not(#div_legobilidad) body>:not(#div_legobilidad)").css('zoom')!=1.4){
            $("html:not(#div_legobilidad) body>:not(#div_legobilidad)").css({ zoom: 1.4 })
            json_.setProp("zoom", zoom_);
            // ver check
            $("#check_zoom3").removeClass("hidePanel");
        }else{
            $("html:not(#div_legobilidad) body>:not(#div_legobilidad)").css({ zoom: 1 })
            json_.setProp("zoom", 0);
        }
    }
}
function doChangeColorBackground(value_){
    //console.log(e.value)
    //$(":root").get(0).style.setProperty('--intelego-customback', e.value);
    $(":root").get(0).style.setProperty('--intelego-customback', value_);
    if ($("*:not(img):not(svg):not(path):not(video):not(.video-js *):not(#div_legobilidad, #div_legobilidad *)").hasClass("customback") == false) {
        $("*:not(img):not(svg):not(path):not(video):not(.video-js *):not(#div_legobilidad, #div_legobilidad *)").addClass("customback");              
    } 
    //console.log("Color Back: " + String(e.value))
    json_.setProp("--intelego-customback", value_); 
}
function doChangeColorText(value_){
    //$(":root").get(0).style.setProperty('--intelego-customfont', e.value);
    console.log("DO CHANGE COLOR TET::::::::")
    $(":root").get(0).style.setProperty('--intelego-customfont', value_);
    if ($("*:not(img):not(svg):not(path):not(video):not(.video-js *):not(#div_legobilidad, #div_legobilidad *)").hasClass("customfont") == false) {
        $("*:not(img):not(svg):not(path):not(video):not(.video-js *):not(#div_legobilidad, #div_legobilidad *)").addClass("customfont");                    
    } 
    //json_.setProp("--intelego-customfont", e.value);
    json_.setProp("--intelego-customfont", value_);
}
function doReset(){
    console.log("RESETEAR:::")
    $("#div_legobilidad #color-texto").val("#000000");
    $("#div_legobilidad #color-fondo").val("#000000");
    $("*:not(img):not(video):not(#div_legobilidad, #div_legobilidad *)").removeClass("customback");
    $("*:not(img):not(video):not(#div_legobilidad, #div_legobilidad *)").removeClass("customfont"); 

    json_.setProp("--intelego-customback", '#000000');
    json_.setProp("--intelego-customfont", '#000000');
}
function doResetAll(){
    console.log("RESETEAR ALL:::")

    // Resetea monocromo
    removeMonocromo();
    
    // quita contraste obscuro
    removeBlackContrast();

    // quita contraste claro
    removeWhiteContrast();

    // Resetear tamaño texto
    num_increase_text = 0;
    doTextChange();
    json_.setProp("num_increase_text", num_increase_text);

    // Resetear tamaño linea de texto
    num_increase_lineheight = 0;
    doLineHeightChange();
    json_.setProp("num_increase_lineheight", num_increase_lineheight);
    
    // Resetear tamaño de epsacio entre palabras
    num_increase_wordspacing = 0;
    doWordSpacingChange();
    json_.setProp("num_increase_wordspacing", num_increase_wordspacing);
    
    // resetear zoom
    zoom = 0;
    updtZoom(zoom);
    
    // Resetear ocultar imagenes / es decir mostrarlas
    removeTagDeleteImages();

    // Resetear color de texto y fondo personalizado 
    doReset();
}
// funciones mostrar/ocultar Panel
function showPanelAccesibility(){
    $("#panel_access").css("opacity",0);

    $("#logo_access").addClass("hidePanel");
    $("#panel_access").addClass("showPanel");
    $("#div_legobilidad").addClass("back_color");

    $("#panel_access").animate({       
        opacity: '1'       
    });
}
function hidePanelAccesibility(){
    $("#logo_access").removeClass("hidePanel");
    $("#panel_access").removeClass("showPanel");
    $("#div_legobilidad").removeClass("back_color");
}
$(document).ready(function () {

    // crea el div de Accesibilidad en la página
    var tag = '';
    tag += '<div id="div_legobilidad" class="pestana_accesibilidad">';
    tag += '    <div id="logo_access">';
    tag += '        <a href="javascript:showPanelAccesibility()"><img src="plugin/images/intelego_icon_accesibilidad.png"></a>';
    tag += '    </div>';
    tag += '    <div id="panel_access" class="hidePanel">';
    tag += '        <div class="header_access"><span class="tit_access">Menú de Accesibilidad</span> <a href="javascript:hidePanelAccesibility()" class="botoncerrar">X</a></div>';
    tag += '        <div class="panel_controls">';
    tag += '            <div class="caja_seccion">';
    tag += '                <h5>Ajustes</h5>';
    tag += '                <div class="caja_btns">';
    tag += '                    <a href="javascript:doDeleteImages()" class="botoncuadro">Quitar imagenes <img id="check_images" src="plugin/images/intelego_check_access.svg" class="check_access hidePanel"></a>';
    tag += '                </div>';
    tag += '            </div>';
    tag += '            <hr>';
    tag += '            <div class="caja_seccion">';
    tag += '                <h5>Ajustes de Saturación y fondo</h5>';
    tag += '                <div class="caja_btns">';
    tag += '                <a href="javascript:doMonocromo()" class="botoncuadro">Monocromo <img id="check_monocromo" src="plugin/images/intelego_check_access.svg" class="check_access hidePanel"><br></a>';
    tag += '                <a href="javascript:doBlackContrast()" class="botoncuadro">Contraste Oscuro <img id="check_cblack" src="plugin/images/intelego_check_access.svg" class="check_access hidePanel"></a>';
    tag += '                <a href="javascript:doWhiteContrast()" class="botoncuadro">Contraste Claro <img id="check_cwhite" src="plugin/images/intelego_check_access.svg" class="check_access hidePanel"></a>';
    tag += '                </div>';
    tag += '            </div>';
    tag += '            <hr>';
    tag += '            <div class="caja_seccion">';
    tag += '                <h5>Ajustes de Zoom</h5>';
    tag += '                <div class="caja_btns">';
    tag += '                <a href="javascript:updtZoom(1)" class="botoncuadro">Zoom 1 <img id="check_zoom1" src="plugin/images/intelego_check_access.svg" class="check_access hidePanel"></a>';
    tag += '                <a href="javascript:updtZoom(2)" class="botoncuadro">Zoom 2 <img id="check_zoom2" src="plugin/images/intelego_check_access.svg" class="check_access hidePanel"></a>';
    tag += '                <a href="javascript:updtZoom(3)" class="botoncuadro">Zoom 3 <img id="check_zoom3" src="plugin/images/intelego_check_access.svg" class="check_access hidePanel"></a>';    
    tag += '                </div>';
    tag += '            </div>';
    tag += '            <hr>';
    tag += '            <div class="caja_seccion">';
    tag += '                <h5>Ajustes de fuente</h5>';
    tag += '                <div class="caja-menosmas">';
    tag += '                    <span class="texto-n">Tamaño de letra</span>';
    tag += '                    <div class="caja_btns">';
    tag += '                        <a href="javascript:doTextMinus();doLineHeightMinus();" class="botoncircular fontminus">-</a>';
    tag += '                        <a href="javascript:doTextPlus();doLineHeightPlus()" class="botoncircular fontplus">+</a>';
    tag += '                    </div>';
    tag += '                </div>';
    /*
    tag += '                <div class="caja-menosmas">';
    tag += '                    <span class="texto-n">Espacio entre líneas</span>';
    tag += '                    <div class="caja_btns">';    
    tag += '                        <a href="javascript:doLineHeightMinus()" class="botoncircular lineminus">-</a>';
    tag += '                        <a href="javascript:doLineHeightPlus()" class="botoncircular lineplus">+</a>';
    tag += '                    </div>';
    tag += '                </div>';
    */
    tag += '                <div class="caja-menosmas">';
    tag += '                    <span class="texto-n">Espacio entre palabras</span>';
    tag += '                    <div class="caja_btns">';        
    tag += '                        <a href="javascript:doWordSpacingMinus()" class="botoncircular wordminus">-</a>';
    tag += '                        <a href="javascript:doWordSpacingPlus()" class="botoncircular wordplus">+</a>';
    tag += '                    </div>';
    tag += '                </div>';
    tag += '            </div>';
    tag += '            <hr>';
    tag += '            <div class="caja_seccion">';
    tag += '                <h5>Ajustes Personalizado</h5>';
    tag += '                <div class="colores-seccion">';
    tag += '                    <span class="texto-n">Color Texto:</span> <input id="color-texto" type="color" onchange="doChangeColorText(this.value)" oninput="doChangeColorText(this.value)">';
    tag += '                    <span class="texto-n">Color fondo:</span> <input id="color-fondo" type="color" onchange="doChangeColorBackground(this.value)" oninput="doChangeColorBackground(this.value)">';
    tag += '                </div>';
    tag += '                <br>';
    tag += '                <div class="colores-seccion"><a href="javascript:doResetAll()" class="botoncuadro-resetear">Restablecer original <img src="plugin/images/intelego_logo_resetear.png" class="img-resetear"></a><img src="plugin/images/intelego_logo_accesibilidad.png" class="img-log-peque"></div>';
    tag += '            </div>';
    tag += '        </div>';
    tag += '    </div>';

    //tag += '  <div>';
    //tag += '    <div><a href="javascript:doResetAll()" class="botoncuadro">Restablecer todos los ajustes</a></div>';
    //tag += '  </div>';    

    tag += '</div>';

    // crea pestaña con controles
    $("body").append(tag)

    // crea las variables de los controles
    init();
});



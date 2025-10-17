    /*-----------------*/
  
  
    function chk_vistos(num) {
      if (wp.debugMode) console.log("🔵 ~ ⭐chk_vistos: ⬇︎ ~~~~~~~~~~~~~~~~~~~");
      if (wp.debugMode) console.log("🔵 ~ getVariantes----:", window.parent.getVariantes(actual))
      //if (wp.debugMode) console.log("🚀 ~ actual:", actual)
    
      if (window.parent.getVariantes(actual) != undefined && window.parent.getVariantes(actual) != 0) {
        chk = window.parent.getVariantes(actual).split(",");
        //atv = window.parent.getVariantes(actual);
      } /* else {
            atv = [0,0];
          } */
    
      if (!num) {
        if (wp.debugMode) console.log("🔵 ~ no existe: num ~ chk_vistos")
        chk_btns('','inicio');
      }
    
      if (window.parent.getPageStatus(actual) === 3) {

        $('.avanzar').removeClass("disabled");
        //$('.mensaje').hide();
      } else {
        $('.avanzar').addClass("disabled");
      }
  
        /*CHECAR SECCIONES para el menu lateral*/
        var chk_sec = [1,2,3,4,5]
    
        
        for (i = 1; i <= chk_sec.length; i++) {
          $('.can' + i).hide();
          $('.god' + i).hide();
          $('.act' + i).hide();
          $('.btn' + i).addClass("disabled");
        }
    
        $('.btn' + actual-1).addClass("w--current");
        $('.btn' + actual-1).removeClass("disabled");

        
  
      for (i = 1; i <= chk_sec.length; i++) {
  
        z = i + 1;
        if (wp.debugMode) console.log("@@@@@@@@@@.getPageStatus---", window.parent.getPageStatus(chk_sec[i-1]), "--- ", chk_sec[i-1]);
        if (window.parent.getPageStatus(chk_sec[i-1]) === 3) {
          /* if (wp.debugMode) console.log('SE COMPLETO', chk_sec[i - 1] )
          if (wp.debugMode) console.log('god', '.god' + (chk_sec[i - 1] - 1))
          if (wp.debugMode) console.log('btn', '.btn' + (chk_sec[i - 1] - 1)) */
  
          $('.btn' + (chk_sec[i-1]-1)).removeClass("disabled");

          //si hay 3 estado act,can,god
          //$('.god' + chk_sec[i-1]).show();
          if ((chk_sec[i-1]-1) == actual) {
            $('.act' + actual).show();
          } else{
            $('.god' + (chk_sec[i-1]-1)).show();
          }

          //habilitar el que sigue
          if (z <= chk_sec.length) {
            $('.btn' + (chk_sec[z-1]-1)).removeClass("disabled");
          }
  
        } else if (window.parent.getPageStatus(chk_sec[i-1]) != 3) {

          
          if ((chk_sec[i-1]) != actual) {
            $('.can' + (chk_sec[i-1]-1)).show();
          }  else {
            $('.act' + (chk_sec[i-1]-1)).show();
          }
        } 
      }
      if (wp.debugMode) console.log("⬆︎ ~~~~~~~~~~~~~~~~~~~~")
    }
    
    function hazVisto(num) {
      if (wp.debugMode) console.log("🔵 ~ ⭐hazVisto:: ", num);
      if (window.parent.getPageStatus(num) != 3) {
        window.parent.setCurrentPage(num);
        window.parent.setCalif(1, 1, 3);
      } else {
        window.parent.set_Brilla();
      }
      chk_vistos(num);
    }
    
    function hazVisto_url(num, url_, type) {
      if (wp.debugMode) console.log("🔵 ~ ⭐hazVisto_url:: " + num + "-- " + url_);
      if (window.parent.getPageStatus(num) != 3) {
        window.parent.setCurrentPage(num);
        window.parent.setCalif(1, 1, 3);
      } else {
        window.parent.set_Brilla();
      }

      chk_vistos(num);
      window.open(url_, "_blank");
    }
    
    function chk_scroll() {
      //if (wp.debugMode) console.log("GO!!");
      if (((window.innerHeight + window.pageYOffset) + 300) >= document.body.offsetHeight) {
        if (window.parent.getPageStatus(actual) != 3) {
          window.parent.setCurrentPage(actual);
          window.parent.setCalif(1, 1, 3);
          if (wp.debugMode) console.log("GO!!");
          //alert("GO!!");
          chk_vistos();
        } else {
          window.parent.set_Brilla();
        }
      }
    };
    
    window.onscroll = function (ev) {
      //chk_scroll();
    };

/*ALTERNATIVA 1*/
var videos = {
  "url_1": "videos/video1.mp4",
  "url_2": "videos/video1.mp4",
  "url_3": "videos/video1.mp4",
  "url_4": "videos/video1.mp4",
  "url_5": "videos/video1.mp4",
  "url_6": "videos/video1.mp4",
	"url_99": "videos/video1.mp4"
}

var videoOptions = {
  controls: true,
  responsive: true,
  autoplay: true,
  preload: 'metadata',
  sources: [{ src: videos[`url_${99}`], type: 'video/mp4' }]
  //tracks: [{ src: `${subs[0]}.vtt`, kind: 'subtitles', srclang: 'es', label: 'Español' }]
}

// create the player using the above options
var player = videojs('my-video', videoOptions);

player.on('ended', function() {
  if (wp.debugMode) console.log("🚀 ~ ended:")
  //root["chk" + 1] = true;
  //chk_btns(1)
  root["chk" + cual_video] = true;
  chk_btns(cual_video);
  $('.vid' + cual_video).hide()
});

player.pause();

$(".btn_video").click(function () {
  if (wp.debugMode) console.log("🚀 ~ btn_video:")
  //$(".pop_video").show();
  $(".pop_video").css("display", "flex")
});

$(".btn_cerrar_video").click(function () {

  $(".pop_video").css("display", "none")
  player.pause();
  player.currentTime(0);
  $(".btn_video" + cual_video).focus();

  //remover los subtitulos
  /* var oldTracks = player.remoteTextTracks();
  var i = oldTracks.length;
  while (i--) {
    player.removeRemoteTextTrack(oldTracks[i]);
  } */

  var oldSubs = player.remoteTextTracks();
  player.removeRemoteTextTrack(oldSubs[0]);

});


// hace que el video tenga un tabindex de 0
$(".video-js").attr("tabindex", "0");
$(".vjs-tech").attr("tabindex", "0");
//----------------

$('.video_storie1').keypress(function (e) {
  if (wp.debugMode) console.log("#my-video keypress")
  var key = e.which;
  if (key == 13) {  // the enter key code
    //$('#my-video').get(0).play()        
    if ($("#my-video video").get(0).paused) {
      $("#my-video video").get(0).play();
    } else {
      $("#my-video video").get(0).pause();
    }
  }
});



var cual_video = '';
function btn_video(var1, var2) {

  cual_video = var2;
  if (wp.debugMode) console.log("🚀 ~ btn_video:", var1)

  player.src({ type: "video/mp4", src: videos[`url_${var1}`] });

  /* 
  //SUBS----------
  var subs = videos[`url_${var1}`].split('.');
  if (wp.debugMode) console.log("🚀 ~ subs:", subs)
  //$('#source_subs').attr("src", `${subs[0]}.vtt`);
  //$('#source').attr("src", videos[`url_${var1}`]);

   player.addRemoteTextTrack({
    src: `${subs[0]}.vtt`,
    srclang: 'es',
    label: 'Español',
    kind: 'subtitulos'
  }, true);
 
  let tracks = player.textTracks();
  tracks[0].mode = 'showing';
  //SUBS----------
  */


  //$(".pop_video").show();
  $(".pop_video").css("display", "flex")

  if (player.paused) {
    player.play();
  } else {
    player.pause();
  }

  setTimeout(function () {
    $("#my-video").focus();
    Resize_vid()
  }, 50)


}

    // funcion para que el video se redimensione
    function Resize_vid() {
      if (wp.debugMode) console.log("🚀 ~ Resize_vid:")
      var windowHeight = parseInt($(".video_storie1").css("height")) * 0.8;
      $("#my-video").css("height", windowHeight + "px")
      $("#my-video").css("width", "80%")
    }
    $( window ).on( "resize", function() {
      Resize_vid()
    } );



/*BTN DESCARGAR*/
// $('.descargar').click(function () {});

/* function download(){
  const a = document.createElement('a')
    a.href = 'descargas/Descargable_Fx.pdf'
    a.download = 'Descargable_Fx.pdf'
    a.click();
    root["chk" + 1] = true;
     chk_btns(1)
}
 
$(".btn_download").click(function () {
  //window.open("descargas/infografia_spei.pdf", "_blank");
  download();
});
 
$('.btn_download').keypress(function (e) {
  var key = e.which;
  if (key == 13)  // the enter key code
  {
  //window.open("descargas/infografia_spei.pdf", "_blank");
  download();
    return false;
  }
}); */
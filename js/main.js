
var audiowand_mode;
var audiowand_media_player;
var audiowand_play_next = -1; 

// This is called when moving between pages first with the
// uri then with the fragment of dom that is about to be displayed.

$(document).bind( "pagecontainerbeforechange", function( e, data ) {
    
        // we stop audio on a page change - no matter where we are going...
        // turn off the audio if it is playing - they must concentrate!
       // stopAudio();
       
});


/*
 *  Page has become visible
 */ 
 $(document).bind( "pagecontainershow", function( e, data ) {
     
     switch(data.toPage.attr("id")){
         case 'map-page':
             stopAudio();
             resizeMapWindow(); // needed when things have a size
             updateMapSize();
             break;
         case 'index-page':
         
            // are we supposed to be play something on load - coming from map page
            if(audiowand_play_next > -1){
                
                var li = $("#audiowand-poi-list li:nth-child(" + (audiowand_play_next+1) + ")");
                
                console.log("going to scroll");

                // scroll it into view then call play on it
                // this stops the warning box being scrolled of the page.
                $('html, body').animate({
                    scrollTop: li.offset().top - 40},
                    400,
                    'swing',
                    function(){
                        console.log("animation over");
                        console.log(li);
                        if(audiowand_play_next > -1){
                            audiowand_play_next = -1;
                            toggleAudio(li);
                        }
                    }
                );
            
            }
            break;
        case 'about-page':
            stopAudio();
            break;
        case 'credits-page':
            stopAudio();
            break;
     }
     
 });


/*
 *  M A P - P A G E 
 */
$(document).on( "pagebeforecreate", "#map-page", function(event) {
   
    // set the canvas to the same size as the full map
    $('#map-canvas').width(audiowand_map.image_width);
    $('#map-canvas').height(audiowand_map.image_height);
   
    // draw the markers on 
    for (var i=0; i < audiowand_pois.length; i++) {
        
        var poi = audiowand_pois[i];
        if (typeof poi.marker == 'undefined') continue;
        
        var div = $('<div>'+ (i+1) +'</div>');
        div.addClass('map-marker');
        //div.addClass('ui-btn-icon-notext');
        //div.addClass('ui-icon-location');
        
        div.attr('id', 'map-marker-' + poi.id);
        
        div.data('audiowand-poi-id', poi.id);
        div.data('audiowand-poi-index', i);
        
        // by their % positions so they move.
        div.css('top', ( (poi.marker.top / audiowand_map.image_height) * 100 ) + '%' );
        div.css('left',( (poi.marker.left / audiowand_map.image_width) * 100 ) + '%' );
        
        // and clickable
        div.click(function(e){
            
            audiowand_play_next = $(this).data('audiowand-poi-index');
            window.location = '#index-page';
            //var li = $("#audiowand-poi-list li:nth-child(" + (index+1) + ")");
            //toggleAudio(li);
            
        });
        
        // put it before the image so it is on top
        $('#map-canvas').prepend(div);
        
    };
   
});

$(document).on('pagecreate', '#map-page', function(e, data) {
     // listen for resize events on the map panel
     $(window).resize(function(e){
          resizeMapWindow();
     });

    // listen to the scroll bar
    $('#slider-zoom').change(updateMapSize);

});

function updateMapSize(){
   // var new_width = audiowand_map.image_width * ( / 100);
   
   // need to move the map as it zooms to keep it centred
   var new_width = $('#slider-zoom')[0].value;
   var changed_width = $('#map-window img').width() - new_width;
   var scroll_left = $('#map-window').scrollLeft();
   $('#map-window').scrollLeft(scroll_left - (changed_width/2));
   
   var new_height = audiowand_map.image_height * (new_width / audiowand_map.image_width);
   var changed_height = $('#map-window img').height() - new_height;
   var scroll_top = $('#map-window').scrollTop();
   $('#map-window').scrollTop(scroll_top - (changed_height/2));
   
   // resize the canvas with the markers on it
   $('#map-canvas').width(new_width);
   $('#map-canvas').height(new_height);
   
   // set the new width
   $('#map-window img').width(new_width);
    //console.log($('#slider-zoom')[0].value);
}

function resizeMapWindow(){
    
    var new_height = $(window).height() - $('#map-page div[data-role="header"]').outerHeight() - $('#map-page div[data-role="footer"]').outerHeight();
    $('#map-window').outerHeight(new_height);
    
    // zoom controller allows maximum zoom to show no white space around map
    var map_aspect = audiowand_map.image_width/audiowand_map.image_height;
    var screen_aspect = $('#map-window').width()/$('#map-window').height();    
    if(screen_aspect > map_aspect){
        // screen is more letterbox like that map so min width of the map is the width of the screen
        $('#slider-zoom').attr('min',  $('#map-window').width());
    }else{
        // screen is less letterbox like than map so min width of map proportional on height
        $('#slider-zoom').attr('min', audiowand_map.image_width * ($('#map-window').height()/audiowand_map.image_height) );
    }
    $('#slider-zoom').attr('max', audiowand_map.image_width);
    
    
    // set the slider position for start
    var max = $('#slider-zoom').attr('max');
    var min = $('#slider-zoom').attr('min');
    var dif = max - min;
    var middle = parseInt(min) + parseInt(dif/2);
    $('#slider-zoom').val(middle);
    $('#slider-zoom').slider('refresh');
    
}

/*
 *  I N D E X - P A G E 
 */
 
 $(document).on( "pagebeforecreate", "#index-page", function(event) {
    console.log('about to creat index-page');
    
    var poi_list = $('#audiowand-poi-list');
    for (var i=0; i < audiowand_pois.length; i++) {
        
        var poi = audiowand_pois[i];
        
        var li = $('<li></li>');
        li.attr('data-icon', 'audio');
        li.data('audiowand-mp3', 'data/' + poi.audio);
        li.data('audiowand-poi-id', poi.id);
        li.click(function(e){
            toggleAudio($(this));
        });
        
        poi_list.append(li);
        
        var a = $('<a></a>');
        li.append(a);
        
        var img = $('<img></img>');
        img.attr('src', 'data/' + poi.image);
        a.append(img);
        
        var h2 = $('<h2>'+ (i+1) + ". " + poi.title   +'</h2>');
        a.append(h2);
        
        var p = $('<p>'+ poi.subtitle   +'</p>');
        a.append(p);
             
    };
    
 });
 
 $(document).on('pagecreate', '#index-page', function(e, data) {
     
     // listen to audio finishing - browser only
     if(!window.cordova){
          $('#audiowand-audio').bind('ended', stopAudio);
     }
     
     // listen to mode switch
     $('#audiowand-mode-earpiece').change(modeChanged);
     $('#audiowand-mode-speaker').change(modeChanged);
     
     // listen for the stop button on the earpiece popup
     $('#audiowand-play-through-earpiece div a').click(function(){
         stopAudio();
     });
     
 });
 
 
 
 function modeChanged(){
     
     // kill any audio to save having to re-route it.
     stopAudio();
     
     // n.b. global var
     audiowand_mode = $(this)[0].value;
     
     if(typeof AudioToggle != 'undefined'){
          switch(audiowand_mode) {
              case 'speaker':
                  AudioToggle.setAudioMode(AudioToggle.SPEAKER);
                  break;
              case 'earpiece':
                  AudioToggle.setAudioMode(AudioToggle.EARPIECE);
                  break;
              default:
                  console.log("Unrecognised audio mode: " + audiowand_mode);
          }
      }else{
          
          alert("AudioToggle not available to set audio mode to: " + audiowand_mode);
          $('#audiowand-mode-speaker').prop('checked', true);
          audiowand_mode = 'speaker';
      }
      
     if(audiowand_mode == 'earpiece'){
        //alert('Audio will come through phones earpiece.');
        $('#audiowand-switch-to-earpiece').popup('open');
     }else{
        //alert('Audio will come through headphones or speaker.');
        $('#audiowand-switch-to-speaker').popup('open');
     }
     
 }
 
 /*
  *  A B O U T - P A G E 
  */
  /*
 $(document).on( "pagebeforecreate", "#about-page", function(event) {
    console.log('about to create about-page');
 });
 
 $(document).on('pagecreate', '#about-page', function(e, data) {
      console.log('about to created about-page');
 });
 */

/*
 * 
 */
function toggleAudio(active_li){
    
    console.log('toggleAudio');
    
    
    // if the audio mode is not set then we initialise
    // it depending on whether AudioToggle is present
    // this needs to happen here because AudioToggle isn't initialised
    // during page create


    if(typeof audiowand_mode == 'undefined'){
    
        console.log("audiowand_mode not set yet");
    
        if(typeof AudioToggle == 'undefined'){
            
            // we don't have access to AudioToggle so default to speaker.
             console.log("AudioToggle NOT present or earpiece NOT available");
             audiowand_mode = 'speaker';
             $('#audiowand-mode-speaker').prop('checked', true).checkboxradio("refresh");
             $('#audiowand-mode-earpiece').prop('checked', false).checkboxradio("refresh");
            // fixme - hide footer all together if we are not on a phone
            //$('#index-page-footer').hide();
            
         }else{
            
              // Looks like we are on a phone so default to earpiece
              console.log("AudioToggle present");
              audiowand_mode = 'earpiece';
              $('#audiowand-mode-earpiece').prop('checked', true).checkboxradio("refresh");
              $('#audiowand-mode-speaker').prop('checked', false).checkboxradio("refresh");
              $('#index-page-footer').show();
            
         }
    
    }

    
    if(typeof AudioToggle == 'undefined'){
        console.log('AudioToggle is undefined');
    }else{
        console.log('setting earpiece mode = ' + AudioToggle.setAudioMode(AudioToggle.EARPIECE));
    }

    
    // if they have clicked on a active link then just stop everything.
    if(active_li.hasClass('stop-state')){
        stopAudio();
        return;
    }
    
    // the current one isn't the active one so kill any others that might be playing
    stopAudio();
    
    // and start this one
    startAudio(active_li);
    
}

function startAudio(active_li){
   
    if(window.cordova){
        startAudioCordova(active_li);
    }else{
        startAudioBrowser(active_li);
    }
    // set the started flag
    $('#audiowand-audio').data('playing', true);
    
    // set the ui state to playing
    active_li.addClass('stop-state');
    active_li.attr('data-icon', 'minus');
    active_li.find('a').removeClass('ui-icon-audio').addClass('ui-icon-minus');
    
    // flash up a dialogue to hold it to your ear
    if(audiowand_mode == 'earpiece'){
         $('#audiowand-play-through-earpiece').popup('open');
    }
    
     //$('#audiowand-play-through-earpiece').popup('open');

}

function startAudioCordova(active_li){
    console.log('startAudioCordova');
    
    var media_url = cordova.file.applicationDirectory + 'www/' + active_li.data('audiowand-mp3');
    console.log('Playing media from: ' + media_url);
    
    audiowand_media_player = new Media(media_url,
        
        // success callback -- called at the end of playback
        function () {
            audiowand_media_player.release();
            stopAudio();
            console.log("Cordova - finished playback");
        },
        
        // error callback
        function (err) {
          audiowand_media_player.release();
          console.log("playAudio():Audio Error: " + err.message);
          if (err.code == MediaError.MEDIA_ERR_ABORTED) console.log("playAudio():Audio Error: MediaError.MEDIA_ERR_ABORTED");
          if (err.code == MediaError.MEDIA_ERR_NETWORK) console.log("playAudio():Audio Error: MediaError.MEDIA_ERR_NETWORK");
          if (err.code == MediaError.MEDIA_ERR_DECODE) console.log("playAudio():Audio Error: MediaError.MEDIA_ERR_DECODE");
          if (err.code == MediaError.MEDIA_ERR_NONE_SUPPORTED) console.log("playAudio():Audio Error: MediaError.MEDIA_ERR_NONE_SUPPORTED");
        }
    );
    
    try{
        audiowand_media_player.play();
    }catch(err){
        console.log(err);
    }
    
}

function startAudioBrowser(active_li){
    $('#audiowand-audio').attr('src', active_li.data('audiowand-mp3'));
    $('#audiowand-audio')[0].play();
}


function stopAudio(){
    console.log('stopAudio');
    
    // actually stop the audio
    if(window.cordova){
        stopAudioCordova();
    }else{
        stopAudioBrowser();
    }
    
    // set the stop
    $('#audiowand-audio').data('playing', false);

    // set the ui state to stopped
    $('#audiowand-poi-list li').removeClass('stop-state');
    $('#audiowand-poi-list li').attr('data-icon', 'audio');
    $('#audiowand-poi-list li').find('a').removeClass('ui-icon-minus').addClass('ui-icon-audio');
    $('#audiowand-play-through-earpiece').popup( "close" );
    

}

function stopAudioCordova(){
     console.log('stopAudioCordova');
     if(audiowand_media_player){
         audiowand_media_player.stop();
     }
}

function stopAudioBrowser(){
     console.log('stopAudioBrowser');
     $('#audiowand-audio')[0].pause();
}



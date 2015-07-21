
var audiowand_media_player;
var audiowand_media_player_status;
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
                
                // scroll it into view then call play on it
                // this stops the warning box being scrolled of the page.
                $('html, body').animate({
                    scrollTop: li.offset().top - 40},
                    400,
                    'swing',
                    function(){
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
       
    // set the map image
    $('#map-page div[id="map-page-content"] img').attr('src', audiowand_map.image);
   
    // set the canvas to the same size as the full map
    $('#map-canvas').width(audiowand_map.image_width);
    $('#map-canvas').height(audiowand_map.image_height);

   // hide the navigation button if it is not on
   if(!audiowand_map.navigation){
       $('#navigation-button').hide();
   }else{
       $('#navigation-button').show();
   }
   
   // hide the location marker when we start
   $('#navigation-location').hide();
   
    // draw the markers on 
    var display_number = 1;
    for (var i=0; i < audiowand_pois.length; i++) {
        
        var poi = audiowand_pois[i];
        if (typeof poi.marker == 'undefined') continue;
        
        var div = $('<div>'+ display_number +'</div>');
        display_number++;
        
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
    
    // flag the fact that this map hasn't been viewed
    audiowand_map.map_viewed = false;
   
});

$(document).on('pagecreate', '#map-page', function(e, data) {
     // listen for resize events on the map panel
     $(window).resize(function(e){
          resizeMapWindow();
     });
     
     // listen for clicking on the navigation button.
     $('#navigation-button').on('click', function(){
         
         // give them a hold message while we fetch the location
         $.mobile.loading( "show", {
            text: 'Fetching location',
            textVisible: true,
            textonly: false,
            html: ""
         });
         
         // go get the location
         navigator.geolocation.getCurrentPosition(
        
             // success
             function(position){
                 $.mobile.loading( "hide" );
                 
                 // convert lon/lat to top/left
                 var px = convertCoordinates(position.coords);

                 // check they actually fall on the map
                 if(px.top < 0 || px.top > audiowand_map.image_height || px.left < 0 || px.left > audiowand_map.image_width){
                     $.mobile.loading( "hide" );
                     $('#map-off-map-popup').popup('open');
                     $('#navigation-location').hide();
                     return;
                 }
                 
                 // check accuracy is sufficient and warn if not
                 if(position.coords.accuracy > 200){
                    $.mobile.loading( "hide" );
                    $('#map-vague-location-popup span.location-accuracy').html(position.coords.accuracy);
                    $('#map-vague-location-popup').popup('open');
                    $('#navigation-location').hide();
                    return;
                 }
                 
                 // convert to percentage      
                 var top = (px.top / audiowand_map.image_height) * 100;
                 var left = (px.left / audiowand_map.image_width) * 100;
                
                 // draw it
                 $('#navigation-location').css('top', top + "%");
                 $('#navigation-location').css('left', left + "%");
                 $('#navigation-location').show();
                 animateNavigationLocationBorder();
                 
                 //centre map on position
                 var scroll_left = px.left - ($('#map-window').width() / 2);
                 var scroll_top = px.top - ($('#map-window').height() / 2);
                 $('#map-window').animate({scrollLeft: scroll_left, scrollTop: scroll_top}, 'slow');
                                  
                 // turn it off after 40 seconds
                 setTimeout(function(){
                     $('#navigation-location').hide();
                 }, 1000 * 40);
             
             },
        
             // failure
             function(error){
                 $.mobile.loading( "hide" );
                 $('#map-no-location-popup').popup('open');
                 $('#navigation-location').hide();
                 return;
             }
        
        );
         
    
     });
     

     // decorate the slider handle
     $('#map-page div.ui-slider-track').prepend('<div class="slider-label"><div class="slider-label-minus">-</div>Zoom<div class="slider-label-plus">+</div></div>');
     
    // listen to the scroll bar
    $('#slider-zoom').change(updateMapSize);

});

function animateNavigationLocationBorder(){
    
    var size = 1;
    
    if($('#navigation-location').is(":visible")){
       
        $('#navigation-location').animate({
                'opacity': '0.1 ',
        }, 1000);

        $('#navigation-location').animate({
                'opacity': '0.8',
        }, 1000, "swing", animateNavigationLocationBorder);
       
    }
    
}

function convertCoordinates(coords){
        
    // find the distance to all the geolocation reference points
    var pos = {'x': coords.longitude, 'y': coords.latitude };
    for(var i = 0; i < audiowand_map.geolocations.length; i++){
        var geo = audiowand_map.geolocations[i];
        console.log(geo.name);
        geo.distance_degrees = getEuclideanDistance(pos, {'x': geo.longitude, 'y': geo.latitude }, true);
    }    
    
    // sort the geolocations by distance from current coords
    audiowand_map.geolocations.sort(function(a,b){
        if (a.distance_degrees < b.distance_degrees) return -1;
         if (a.distance_degrees > b.distance_degrees) return 1;
         return 0;
    });
    
    // a, b & c are the closest three geolocations to our coordinate - we work with these
    var a = audiowand_map.geolocations[0];
    var b = audiowand_map.geolocations[1];
    var c = audiowand_map.geolocations[2];
    
    // calculate the local pixel pitch - or scale in px/degree based on the closest two points
    var ab_pixels = getEuclideanDistance({'x': a.left, 'y': a.top }, {'x': b.left, 'y': b.top });
    var ab_degrees = getEuclideanDistance({'x': a.longitude, 'y': a.latitude }, {'x': b.longitude, 'y': b.latitude }, true);
    var scale = ab_pixels / ab_degrees;

    // distance we are from each of the three nearest points in pixels
    a.distance_pixels = a.distance_degrees * scale;
    b.distance_pixels = b.distance_degrees * scale;
    c.distance_pixels = c.distance_degrees * scale;

    // Take the closest point and rotate around it at the scaled distance looking for candidate locations
    // from 0 to half a radian - 90 degrees then do the other four quarters
    var candidates = [];
    for(var i = 0; i <= 0.5; i = i + 0.05){
        
        // use sine rule to calculate x_offset
        var x_offset = Math.round(a.distance_pixels * Math.sin(Math.PI * i));
        
        // use pythagoras to get the y offset 
        var y_offset = Math.round(Math.sqrt( (a.distance_pixels * a.distance_pixels) - (x_offset * x_offset) ));
        
        // This gives us one of four locations around the circle so we create the others too
        candidates.push( {'left': a.left + x_offset, 'top': a.top + y_offset } );
        candidates.push( {'left': a.left - x_offset, 'top': a.top + y_offset } );
        candidates.push( {'left': a.left + x_offset, 'top': a.top - y_offset } );
        candidates.push( {'left': a.left - x_offset, 'top': a.top - y_offset } );
    
    }
    
    // work through the candidates 
    // find the distance in pixels on the image and compare it with the distance in pixels calculated from the lat/lon
    // sum the error of the two
    for(var i = 0; i < candidates.length; i++){
        var x = candidates[i];
        var xb = getEuclideanDistance({'x': x.left, 'y': x.top },{'x': b.left, 'y': b.top });
        xb = Math.abs(xb - b.distance_pixels );
        var xc = getEuclideanDistance({'x': x.left, 'y': x.top },{'x': c.left, 'y': c.top });
        xc = Math.abs(xc - c.distance_pixels );
        x.distance_error_pixels = xb + xc;
    }
    
    candidates.sort(function(a,b){
        if (a.distance_error_pixels < b.distance_error_pixels) return -1;
         if (a.distance_error_pixels > b.distance_error_pixels) return 1;
         return 0;
    });
    
    // top candidate is returned
    return candidates[0];
    
}

function getEuclideanDistance(a, b, normalise_latitude){
    
    var x = Math.abs(a.x - b.x);
    var y = Math.abs(a.y - b.y);
    
    // the further from the equator the finer pitch
    // latitude is so we need to normalise it
    
    if(normalise_latitude){
        y = y * (1-(y/90));
    }
    
    var dist = Math.sqrt( (x * x) + (y * y) ); // pythagorus
    return dist;
}

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

    // if we haven't seen the map before we initialise it
    if(!audiowand_map.map_viewed){
 
        // set the slider position for start
        var max = $('#slider-zoom').attr('max');
        var min = $('#slider-zoom').attr('min');
        var dif = max - min;
        var middle = parseInt(min) + parseInt(dif/2);
        $('#slider-zoom').val(min);
        $('#slider-zoom').slider('refresh');
        
        // centre the map
        var map_centre = $('#map-canvas').width() / 2;
        var window_centre = $('#map-window').width() / 2;
        var left_offset = map_centre - window_centre;
        $('#map-window').scrollLeft( left_offset );
        var map_middle = $('#map-canvas').width() / 2;
        var window_middle = $('#map-window').width() / 2;
        var top_offset = map_middle - window_middle;
        $('#map-window').scrollTop( left_offset );
        
        // flag that we have seen this
        audiowand_map.map_viewed = true;
    
    }
    
}


/*
 *  I N D E X - P A G E 
 */
 
 $(document).on( "pagebeforecreate", "#index-page", function(event) {
    
    var poi_list = $('#audiowand-poi-list');
    var display_number = 1;
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
        
        if ( !audiowand_config.display_numbers_in_list  || typeof poi.marker == 'undefined' ){
            var h2 = $('<h2>'+ poi.title   +'</h2>');
        }else{
            var h2 = $('<h2>'+ display_number + ". " + poi.title   +'</h2>');
            display_number++;
        }
        a.append(h2);
        
        var p = $('<p>'+ poi.subtitle   +'</p>');
        a.append(p);
             
    };
    
    $('#index-page div[data-role="footer"]').hide();
    
 });
 
 $(document).on('pagecreate', '#index-page', function(e, data) {
     
     // listen to audio finishing - browser only
     if(!window.cordova){
          $('#audiowand-audio').bind('ended', stopAudio);
     }
     
     // swipe page change
     $('#index-page').on('swipeleft', function(){
         $( ":mobile-pagecontainer" ).pagecontainer( "change", "#map-page", {transition: 'slide'});
     });
     $('#index-page').on('swiperight', function(){
         $( ":mobile-pagecontainer" ).pagecontainer( "change", "#about-page", {transition: 'slide', reverse: true});
     });
     
     // wire up the buttons to stop and pause
     $('#audio-stop-button').bind('click', stopAudio);
     $('#audio-pause-button').bind('click', pauseAudio);
     $('#audio-restart-button').bind('click', restartAudio);
    
 });
 
 
 /*
  *  A B O U T - P A G E 
  */
  
 $(document).on( "pagebeforecreate", "#about-page", function(event) {
 
    // load the content from the data directory
    $( '#about-page div[data-role="content"]' ).load( "data/about.html" );
 
 });
 
 $(document).on('pagecreate', '#about-page', function(e, data) {
      
      $('#about-page').on('swipeleft', function(){
          $( ":mobile-pagecontainer" ).pagecontainer( "change", "#index-page", {transition: 'slide'});
      });
      
      $('#about-page').on('swiperight', function(){
          $( ":mobile-pagecontainer" ).pagecontainer( "change", "#credits-page", {transition: 'slide', reverse: true});
      });
 });
 
 /*
  *  C R E D I T S - P A G E 
  */
  
 $(document).on( "pagebeforecreate", "#credits-page", function(event) {
 
    // load the content from the data directory
    $( '#credits-page div[data-role="content"]' ).load( "data/credits.html" );
 
 });
 
 $(document).on('pagecreate', '#credits-page', function(e, data) {
      
      $('#credits-page').on('swipeleft', function(){
          $( ":mobile-pagecontainer" ).pagecontainer( "change", "#about-page", {transition: 'slide'});
      });
      
 });
 

/*
 * 
 */
function toggleAudio(active_li){
    
    // if they have clicked on a active link then just stop everything.
    if(active_li.hasClass('stop-state')){
        stopAudio();
        return;
    }
    
    // the current one isn't the active one is another one active?
    if($('#audiowand-audio').data('playing')){
        stopAudio();
        // wait a half a mo for it to die before we start the new one
        setTimeout(function(){startAudio(active_li)}, 500);
    }else{
        // and start this one
        startAudio(active_li);
    }

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
    
    $('#index-page div[data-role="footer"]').slideDown();
    
}

function startAudioCordova(active_li){
    
    //var media_url = cordova.file.applicationDirectory + 'www/' + active_li.data('audiowand-mp3');
    
    // Android - needs different URL
    var media_url = active_li.data('audiowand-mp3');
    if (device.platform == "Android") {
        media_url = '/android_asset/www/' + media_url;
    }
    
    // we need to be careful not to create an extra media player
    // if it is undefined or false then go for it
   if (typeof audiowand_media_player == 'undefined' || audiowand_media_player == false){
       
       audiowand_media_player = new Media(media_url,

           // success callback -- called at the end of playback
           function () {
               audiowand_media_player.release();
               stopAudio();
               audiowand_media_player = false;
           },

           // error callback
           function (err) {
             audiowand_media_player.release();
             if (err.code == MediaError.MEDIA_ERR_ABORTED) console.log("playAudio():Audio Error: MediaError.MEDIA_ERR_ABORTED");
             if (err.code == MediaError.MEDIA_ERR_NETWORK) console.log("playAudio():Audio Error: MediaError.MEDIA_ERR_NETWORK");
             if (err.code == MediaError.MEDIA_ERR_DECODE) console.log("playAudio():Audio Error: MediaError.MEDIA_ERR_DECODE");
             if (err.code == MediaError.MEDIA_ERR_NONE_SUPPORTED) console.log("playAudio():Audio Error: MediaError.MEDIA_ERR_NONE_SUPPORTED");
             audiowand_media_player = false;
           },
           
           // status callback
           function (status){
               audiowand_media_player_status = status;
           }
           
       );
       
       try{
           audiowand_media_player.play();
       }catch(err){
           audiowand_media_player = false;
       }
       
   } // check it doesn't already exist
    
    
    
}

function startAudioBrowser(active_li){
    $('#audiowand-audio').attr('src', active_li.data('audiowand-mp3'));
    $('#audiowand-audio')[0].play();
}


function stopAudio(){
    
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
    $('#index-page div[data-role="footer"]').slideUp("slow", function(){
        $('#audio-stop-button').removeClass('ui-btn-active');
        $('#audio-restart-button').removeClass('ui-btn-active');
    });
    

}

function stopAudioCordova(){
     if(audiowand_media_player){
         audiowand_media_player.stop();
     }
}

function stopAudioBrowser(){
     $('#audiowand-audio')[0].pause();
}

function restartAudio(){
    var active_li = $('#audiowand-poi-list li.stop-state');
    stopAudio();
    $('#audio-restart-button').removeClass('ui-btn-active');
    // wait a half a mo for it to die before we start the new one
    setTimeout(function(){startAudio(active_li)}, 500);
}

function pauseAudio(){
    if(window.cordova){
        pauseAudioCordova();
    }else{
        pauseAudioBrowser();
    }
}

function pauseAudioBrowser(){
    if($('#audiowand-audio')[0].paused){
        $('#audiowand-audio')[0].play();
        $('#audio-pause-button').removeClass('ui-btn-active');
    }else{
        $('#audiowand-audio')[0].pause();
        $('#audio-pause-button').addClass('ui-btn-active');
    }
}

function pauseAudioCordova(){
    
    if (audiowand_media_player){
        if(audiowand_media_player_status == Media.MEDIA_RUNNING){
            audiowand_media_player.pause();
            $('#audio-pause-button').addClass('ui-btn-active');
        }else{
            audiowand_media_player.play();
            $('#audio-pause-button').removeClass('ui-btn-active');
        }
    }
    
}

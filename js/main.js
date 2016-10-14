
// set up an object to act as a namespace

var audiowand = {    
    media_player: false,
    play_next: -1,
    location_watcher: false,
    location_imprecise: false,
    location_error: false,
    location_current: false,
    location_distance_off: false,
};

/*
 * W H O L E - D O C U M E N T 
 */
 $( function() {
     // set the map image so it is already laoded in the dom
     $('#map-page div[id="map-page-content"] img').attr('src', audiowand_map.image);
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
            if(audiowand.play_next > -1){
                
                var li = $("#audiowand-poi-list li:nth-child(" + (audiowand.play_next+1) + ")");
                
                // scroll it into view then call play on it
                // this stops the warning box being scrolled of the page.
                $('html, body').animate({
                    scrollTop: li.offset().top - 40},
                    400,
                    'swing',
                    function(){
                        if(audiowand.play_next > -1){
                            audiowand.play_next = -1;
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
    
    console.log("About Creating map-page");
   
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
        
        // markers replacement label - used instead of the number
        var label = "";
        if(typeof poi.label != 'undefined') label = poi.label;
        else label = display_number;
        
        var div = $('<div>'+ label + '</div>');
        display_number++;
        
        div.addClass('map-marker');
        if(typeof poi.class != 'undefined') div.addClass(poi.class);
        
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
            
            audiowand.play_next = $(this).data('audiowand-poi-index');
            // window.location = '#index-page';
            $( ":mobile-pagecontainer" ).pagecontainer( "change", "#index-page", {transition: 'fade'});
            //var li = $("#audiowand-poi-list li:nth-child(" + (index+1) + ")");
            //toggleAudio(li);
            
        });
        
        // put it before the image so it is on top
        $('#map-canvas').prepend(div);
        
    };
    
    // flag the fact that this map hasn't been viewed
    audiowand_map.map_viewed = false;
   
});

/* Great for adding listeners */
$(document).on('pagecreate', '#map-page', function(e, data) {
    
    console.log("Creating map-page");
    
     // listen for resize events on the map panel
     $(window).resize(function(e){
          resizeMapWindow();
     });
     
     // listen for clicking on the navigation button.
     $('#navigation-button').on('click', function(){
    
         // stop them pressing the button again till we are done
         $('#navigation-button').addClass('ui-disabled');
         audiowand.location_current = false;
         audiowand.location_distance_off = false;
    
         // give them a hold message while we fetch the location
         $.mobile.loading( "show", {
            text: 'Fetching location',
            textVisible: true,
            textonly: false,
            html: ""
         });
         
         // go get the location
         audiowand.location_watcher = navigator.geolocation.watchPosition(
        
             // success
             function(position){
                  
                // console.log('https://www.google.co.uk/maps/?q=' + position.coords.latitude + ',' + position.coords.longitude);

                // only do something if we are given a new position
                if(
                    audiowand.location_current
                    && audiowand.location_current.longitude == position.coords.longitude
                    && audiowand.location_current.latitude == position.coords.latitude
                    && audiowand.location_current.latitude == position.coords.accuracy
                ){
                    return;
                }

                 // convert lon/lat to top/left
                 var px = convertCoordinates(position.coords);
                 
                 // check accuracy is sufficient
                 // precision may be defined in the data if not default to 200m
                 var required_precision = 200;
                 if(typeof audiowand_map.required_precision !== 'undefined'){
                     required_precision = audiowand_map.required_precision;
                 }
                 if(position.coords.accuracy > required_precision){
                    audiowand.location_imprecise = true;
                    return;
                 }else{
                     audiowand.location_imprecise = false;
                 }
                 
                 // check they actually fall on the map - die if they don't
                 if(px.top < 0 || px.top > audiowand_map.image_height || px.left < 0 || px.left > audiowand_map.image_width){                     
                     
                     navigator.geolocation.clearWatch(audiowand.location_watcher); // stop gps
                     $.mobile.loading( "hide" ); // hide the loading
                     $('#navigation-location').hide(); // hide the dot
                     $('#navigation-button').removeClass('ui-disabled');
                     
                     // display a message.
                     if(audiowand.location_distance_off){
                         var distance_off = Math.round(audiowand.location_distance_off/1000);
                         $('#map-off-distance span').html(distance_off);
                         $('#map-off-distance').show();
                     }else{
                         $('#map-off-distance span').html('-');
                         $('#map-off-distance').hide();
                     }
                     
                     $('#map-off-map-popup').popup('open');
    
                     return;
                 }
                 
                 // got to here so it is plotable.
                 $.mobile.loading( "hide" );
                 audiowand.location_error = false;
                 audiowand.location_current = position.coords;                 
                
                 // convert to percentage      
                 var top = (px.top / audiowand_map.image_height) * 100;
                 var left = (px.left / audiowand_map.image_width) * 100;
                
                 // draw it
                 $('#navigation-location').css('top', top + "%");
                 $('#navigation-location').css('left', left + "%");
                 $('#navigation-location').show();
                 animateNavigationLocationBorder();
                 
                 //centre map on position
                 var scroll_top = ($('#map-canvas').height() *  (top/100) ) - ($('#map-window').height() / 2);
                 var scroll_left = ($('#map-canvas').width() * (left/100) ) - ($('#map-window').width() / 2);
                 $('#map-window').animate({scrollLeft: scroll_left, scrollTop: scroll_top}, 'slow');

             },
        
             // outright failure!
             function(error){
                 console.log(error);
                 audiowand.location_error = error;

                 return;
             },
             
             // options
             {
               enableHighAccuracy: true, 
               maximumAge        : 10 * 1000, 
               timeout           : 10 * 1000
             }
        
        );
        
        // After 30seconds we stop updating the location
        // and confess the results if any.
        setTimeout(function(){
            
            navigator.geolocation.clearWatch(audiowand.location_watcher);
            audiowand.location_current = false;
            
            $('#navigation-location').hide(); // hide the dot
            $.mobile.loading( "hide" ); // hide the loading if it showing
            
            // if we never got precise enough tell them.
            if(audiowand.location_imprecise){
                $('#map-vague-location-popup span.location-accuracy').html(position.coords.accuracy);
                $('#map-vague-location-popup').popup('open');
            }else if(audiowand.location_error){
                $('#map-no-location-popup').popup('open');
            }
            
            $('#navigation-button').removeClass('ui-disabled');
            
        }, 30 * 1000);
    
     });
     

     // decorate the slider handle
     $('#map-page div.ui-slider-track').prepend('<div class="slider-label"><div class="slider-label-minus">-</div>Zoom<div class="slider-label-plus">+</div></div>');
     
    // listen to the scroll bar
    $('#slider-zoom').change(updateMapSize);
    
    $('#map-canvas').doubleTap(function(){
        
        var slider = $('#slider-zoom')[0];
        var max = parseInt(slider.max);
        var min = parseInt(slider.min);
        var val = parseInt(slider.value);
        var new_val = ((max - val)/2) + val;
        
        // if the new value is < 20% of the max we make it the max
        var range = max - min;
        var proportion = (new_val - min)/range;
        if(proportion > 0.8) new_val = max;

        console.log(slider.min + ' - '  + val + ' - ' + slider.max);
        console.log(slider.min + ' - '  + new_val + ' - ' + slider.max + " : " + proportion);
        $('#slider-zoom').val(new_val);
        $('#slider-zoom').slider('refresh');


    });

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
        //console.log(geo.name);
        //geo.distance_degrees = getEuclideanDistance(pos, {'x': geo.longitude, 'y': geo.latitude }, true);
        geo.distance_degrees = getHaversineDistance(pos, {'x': geo.longitude, 'y': geo.latitude });
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
    
    // capture the distance to the nearest point for use in offsite estimate
    audiowand.location_distance_off = a.distance_degrees;
    
    // calculate the local pixel pitch - or scale in px/degree based on the closest two points
    var ab_pixels = getEuclideanDistance({'x': a.left, 'y': a.top }, {'x': b.left, 'y': b.top });
    var ab_degrees = getHaversineDistance({'x': a.longitude, 'y': a.latitude }, {'x': b.longitude, 'y': b.latitude });
    var scale = ab_pixels / ab_degrees;

    // distance we are from each of the points in pixels
    for(var i = 0; i < audiowand_map.geolocations.length; i++){
        audiowand_map.geolocations[i].distance_pixels = audiowand_map.geolocations[i].distance_degrees * scale;
    }
    
    // Take the closest point and rotate around it at the scaled distance looking for candidate locations
    // from 0 to half a radian - 90 degrees then do the other four quarters
    var candidates = [];
    for(var i = 0; i <= 0.5; i = i + 0.05){
        
        // use sine rule to calculate x_offset
        var x_offset = Math.round(a.distance_pixels * Math.sin(Math.PI * i));
        
        // use pythagoras to get the y offset 
        var y_offset = Math.round(Math.sqrt( Math.abs((a.distance_pixels * a.distance_pixels) - (x_offset * x_offset)) ));
        
        // This gives us one of four locations around the circle so we create the others too
        candidates.push( {'left': a.left + x_offset, 'top': a.top + y_offset } );
        candidates.push( {'left': a.left - x_offset, 'top': a.top + y_offset } );
        candidates.push( {'left': a.left + x_offset, 'top': a.top - y_offset } );
        candidates.push( {'left': a.left - x_offset, 'top': a.top - y_offset } );
    
    }
    
    // debug lets plot those!
    /*
    for(var i = 0; i < candidates.length; i++){
        var can = candidates[i];
        var dot = $('<div style="position:absolute;">*</div>');
        $('#map-canvas').append(dot);
        dot.css('top', (can.top / audiowand_map.image_height) * 100 + "%");
        dot.css('left', (can.left / audiowand_map.image_width) * 100 + "%");
    }
    
    var a_dot = $('<div style="position:absolute;">a</div>');
    a_dot.css('top', (a.top / audiowand_map.image_height) * 100 + "%")
    a_dot.css('left', (a.left / audiowand_map.image_width) * 100 + "%");
    $('#map-canvas').append(a_dot);
    */

    // we find up to four geopoints that surround our potential position
    // the geolocations are already arranged by closeness
    var cardinal = {N: false, E: false, S: false, W: false};
    for(var i = 0; i < audiowand_map.geolocations.length; i++){
        
        // if we have filled all the slots then stop looking
        if(cardinal.N && cardinal.E && cardinal.S && cardinal.W) break;
        
        var geo = audiowand_map.geolocations[i];
        if(!cardinal.N && geo.latitude > coords.latitude){
            cardinalN = geo;
            continue;
        }
        if(!cardinal.E && geo.longitude > coords.longitude){
            cardinal.E = geo;
            continue;
        }
        if(!cardinal.S && geo.latitude < coords.latitude){
            cardinal.S = geo;
            continue;
        }
        if(!cardinal.W && geo.longitude < coords.longitude){
            cardinal.W = geo;
            continue;
        }
    
    }
      
    for(var i = 0; i < candidates.length; i++){

        var total_deviation = 0;       
        var candidate = candidates[i];
               
        $.each(cardinal, function( key, geo ) {
        
            // edge of map we might not have a point to the N,S,E or W of current position
            if(!geo) return;
            
            // do the distance from each of the candidates to the for cardinals
            var candidate2geo = getEuclideanDistance({'x': candidate.left, 'y': candidate.top }, {'x': geo.left, 'y': geo.top }); // convert to xy distances
            var difference = geo.distance_pixels - candidate2geo;
            total_deviation += Math.abs(difference)/((geo.distance_pixels + candidate2geo)/2);
        
        });

        candidate.distance_error_pixels = total_deviation;

    }
    
    candidates.sort(function(a,b){
        if (a.distance_error_pixels < b.distance_error_pixels) return -1;
         if (a.distance_error_pixels > b.distance_error_pixels) return 1;
         return 0;
    });
  
    // top candidate is returned
    return candidates[0];
    
}
/*
    borrowed from: http://www.movable-type.co.uk/scripts/latlong.html
*/
function getHaversineDistance(a, b){
    
    var lat1 = a.y;
    var lon1 = a.x;
    var lat2 = b.y;
    var lon2 = b.x;
    
    var R = 6371000; // metres
    var t1 = lat1.toRadians();
    var t2 = lat2.toRadians();
    var at = (lat2-lat1).toRadians();
    var al = (lon2-lon1).toRadians();
    var a = Math.sin(at/2) * Math.sin(at/2) +
            Math.cos(t1) * Math.cos(t2) *
            Math.sin(al/2) * Math.sin(al/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
        
    return d;
}

function getEuclideanDistance(a, b){
    
    var x = Math.abs(a.x - b.x);
    var y = Math.abs(a.y - b.y);
//    console.log('x,y :' + x + "," + y);    
    var dist = Math.sqrt( (x * x) + (y * y) ); // pythagorus
    return dist;
}

function updateMapSize(){
   // var new_width = audiowand_map.image_width * ( / 100);
   
   // need to move the map as it zooms to keep it centred
   var new_width = $('#slider-zoom')[0].value;
   var changed_width = $('#map-window img').width() - new_width;
   var scroll_left = $('#map-window').scrollLeft();
   var new_scroll_left = parseInt(scroll_left - (changed_width/2));
   if (new_scroll_left < 0) new_scroll_left = 0;
      
   var new_height = audiowand_map.image_height * (new_width / audiowand_map.image_width);
   var changed_height = $('#map-window img').height() - new_height;
   var scroll_top = $('#map-window').scrollTop();
   var new_scroll_top = parseInt(scroll_top - (changed_height/2));
   if(new_scroll_top < 1) new_scroll_top = 0;

   // resize the canvas with the markers on it
   $('#map-canvas').width(new_width);
   $('#map-canvas').height(new_height);
   
   // set the new width of the image
   $('#map-window img').width(new_width);
   
   // set the scroll position
   $('#map-window').scrollTop(new_scroll_top);   
   $('#map-window').scrollLeft(new_scroll_left);
   
   /*
   $('#map-window').animate({ scrollTop: new_scroll_top + "px", scrollLeft: new_scroll_left + "px" }, function(){
        console.log("finished animation: " +  $('#map-window').scrollTop()); 
    });
    */
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
      $('#credits-page').on('swiperight', function(){
          $( ":mobile-pagecontainer" ).pagecontainer( "change", "#about-page", {transition: 'slide', reverse: true});
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
   if (audiowand.media_player == false){
       
       audiowand.media_player = new Media(media_url,

           // success callback -- called at the end of playback
           function () {
               audiowand.media_player.release();
               stopAudio();
               audiowand.media_player = false;
           },

           // error callback
           function (err) {
             audiowand.media_player.release();
             if (err.code == MediaError.MEDIA_ERR_ABORTED) console.log("playAudio():Audio Error: MediaError.MEDIA_ERR_ABORTED");
             if (err.code == MediaError.MEDIA_ERR_NETWORK) console.log("playAudio():Audio Error: MediaError.MEDIA_ERR_NETWORK");
             if (err.code == MediaError.MEDIA_ERR_DECODE) console.log("playAudio():Audio Error: MediaError.MEDIA_ERR_DECODE");
             if (err.code == MediaError.MEDIA_ERR_NONE_SUPPORTED) console.log("playAudio():Audio Error: MediaError.MEDIA_ERR_NONE_SUPPORTED");
             audiowand.media_player = false;
           },
           
           // status callback
           function (status){
               audiowand.media_player_status = status;
           }
           
       );
       
       try{
           audiowand.media_player.play();
       }catch(err){
           audiowand.media_player = false;
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
     if(audiowand.media_player){
         audiowand.media_player.stop();
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
    
    if (audiowand.media_player){
        if(audiowand.media_player_status == Media.MEDIA_RUNNING){
            audiowand.media_player.pause();
            $('#audio-pause-button').addClass('ui-btn-active');
        }else{
            audiowand.media_player.play();
            $('#audio-pause-button').removeClass('ui-btn-active');
        }
    }
    
}

/** Extend Number object with method to convert numeric degrees to radians */
if (Number.prototype.toRadians === undefined) {
    Number.prototype.toRadians = function() { return this * Math.PI / 180; };
}


/** Extend Number object with method to convert radians to numeric (signed) degrees */
if (Number.prototype.toDegrees === undefined) {
    Number.prototype.toDegrees = function() { return this * 180 / Math.PI; };
}


/* add double tap function */
(function($) {
     $.fn.doubleTap = function(doubleTapCallback) {
         return this.each(function(){
			var elm = this;
			var lastTap = 0;
			$(elm).bind('vmousedown', function (e) {
                                var now = (new Date()).valueOf();
				var diff = (now - lastTap);
                                lastTap = now ;
                                if (diff < 250) {
		                    if($.isFunction( doubleTapCallback ))
		                    {
		                       doubleTapCallback.call(elm);
		                    }
                                }      
			});
         });
    }
})(jQuery);


$(document).bind('pageinit', function(e, data) {

    console.log("- pageinit -");
     
});

// This is called when moving between pages first with the
// uri then with the fragment of dom that is about to be displayed.
$(document).bind( "pagecontainerbeforechange", function( e, data ) {
   
        // When received with data.toPage set to a string, the event indicates that navigation is about to commence.
        //The value stored in data.toPage is the URL of the page that will be loaded.
        if( typeof data.toPage === "string" ){

          // urls are designed of the form #some-page?key1=value1&key2=value1
          // the key/values are set as global values i.e. change the state of the app
          
          /*
         var u = $.mobile.path.parseUrl( data.toPage );
         if(u.hash){
             var search_part = u.hash.substring(u.hash.indexOf('?') +1 );
             var vars = search_part.split('&');
             for (var i = 0; i < vars.length; i++) {
                 var pair = vars[i].split('=');
                 setCookie(decodeURIComponent(pair[0]),decodeURIComponent(pair[1]),365);
             }
         }
         */

        // When received with data.toPage set to a jQuery object, the event indicates that the destination page has been loaded and navigation will continue.
        } else {

            // switch statement to call the page update functions...
            switch(data.toPage.attr("id")){
                case 'index-page':
                    initIndexPage();
                    break;
                default:
                    console.log("No init method for " + data.toPage.attr("id"));
            }


        }
    
});

function initIndexPage(){
    console.log('Init index-page');
    
    // if we haven't set up the list of poi yet we should set it up
    var poi_list = $('#audiowand-poi-list');
    
    if(poi_list.children().length == 0){
        for (var i=0; i < audiowand_pois.length; i++) {
            
            var poi = audiowand_pois[i];
            
            var li = $('<li></li>');
            li.attr('data-icon', 'audio');
            li.attr('data-audiowand-mp3', 'data/' + poi.audio);
            li.click(function(e){
            
                // start playing the audio
                console.log($(this).data('audiowand-mp3'));
            
            
            
            });
            
            poi_list.append(li);
            
            var a = $('<a></a>');
            li.append(a);
            
            var img = $('<img></img>');
            img.attr('src', 'data/' + poi.image);
            a.append(img);
            
            var h2 = $('<h2>'+ poi.title   +'</h2>');
            a.append(h2);
            
            var p = $('<p>'+ poi.subtitle   +'</p>');
            a.append(p);
            
                        
        };
        
    }
    
}


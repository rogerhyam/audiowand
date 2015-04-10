
Audiowand
=========

A very simple audio tour app built with Cordova

n.b. This is early days - don't get excited!

Setting up a Tour build environment
===================================

* Use Cordova CLI to build the app
        https://cordova.apache.org/docs/en/4.0.0/guide_cli_index.md.html
* Create a Cordova application e.g.
        cordova create glasshouses uk.org.rbge.hyam.audiowand.glasshouses Glasshouses
* Add the media plugin and others - the file plugin will be auto added
        cordova plugin add org.apache.cordova.media
        cordova plugin add org.apache.cordova.device
        cordova plugin add org.apache.cordova.splashscreen
        cordova plugin add org.apache.cordova.statusbar
* Add the platforms
        cordova platform add ios
        cordova platform add android
* Clone a copy of audiowand into the application directory (not www)
        git clone https://github.com/rogerhyam/audiowand
* Copy the update_core.sh script from the cloned repository to your Cordova project directory and run it.
    cp audiowand/update_core.sh .
    chmod +x update_core.sh
    ./update_core.sh
* (You can run the update_core script anytime you think the git repository might have changed)
* Initialise your data directory with the test data from the core build you only want to do this once at the beginning!
    cp -r audiowand/data/* www/data
* Get a copy of the config.xml in the www and remove the Cordova one. We use one in the WWW to make it simpler with Phonegap 
    rm config.xml
    cp audiowand/config.xml www/config.xml
* Build it e.g.
    cordova build android
* We are now free to change anything under www/data and the www/config.xml. Other files will be overwritten by update_core.sh
    


Cordova Plugins Required
========================
org.apache.cordova.file 1.3.3 "File"
org.apache.cordova.media 0.2.16 "Media"
org.apache.cordova.device 0.3.0 "Device"
org.apache.cordova.splashscreen 1.0.0 "Splashscreen"
org.apache.cordova.statusbar 0.1.10 "StatusBar"

Useful for Debug
================
cd /Users/rogerhyam/android-sdks/platform-tools
./adb  logcat CordovaLog:D *:S


Creating Synthesised Voice on a Mac
===================================
There is a directory in www/data/script that can be used for managing the audio scripts. There is a bash script in there for generating synthetic voice for testing on a mac.



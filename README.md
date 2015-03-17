

Cordova Plugins Required
========================
org.apache.cordova.file 1.3.3 "File"
org.apache.cordova.media 0.2.16 "Media"
com.dooble.audiotoggle
org.awokenwell.proximity

https://build.phonegap.com/plugins/714



Useful for Debug
================
cd /Users/rogerhyam/android-sdks/platform-tools
./adb  logcat CordovaLog:D *:S


Developing a Tour
=================

* Clone the github repository of the core into a directory somewhere
    /path/to/core/clone
* Use Cordova CLI to build the app
* Create a Cordova application e.g.
    cordova create glasshouses uk.org.rbge.hyam.audiowand.glasshouses Glasshouses
* Copy the update_core.sh script from the cloned repository to your Cordova project directory (not the WWW director but below it).
* Edit the 



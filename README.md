
Audiowand
=========

A very simple audio tour app built with Cordova

n.b. This is early days - don't get excited!

Setting up a Tour build environment
===================================

* Use Cordova CLI to build the app
  * https://cordova.apache.org/docs/en/4.0.0/guide_cli_index.md.html
* Create a Cordova application e.g.
  * `cordova create glasshouses uk.org.rbge.hyam.audiowand.glasshouses Glasshouses`
  
    this will create a `glasshouses` directory at your current location.
* Add the media plugin and others (`cordova plugin add <name>`) - the file plugin will be auto added 
        
  *  cordova-plugin-background-audio 1.0.0 "background-audio"
  *  cordova-plugin-device 1.0.1 "Device"
  *  cordova-plugin-file 3.0.0 "File"
  *  cordova-plugin-geolocation 1.0.1 "Geolocation"
  *  cordova-plugin-inappbrowser 1.0.1 "InAppBrowser"
  *  cordova-plugin-media 1.0.1 "Media"
  *  cordova-plugin-splashscreen 2.1.0 "Splashscreen"
  *  cordova-plugin-statusbar 1.0.1 "StatusBar"
        
* Add the platforms
  * `cordova platform add ios`
  * `cordova platform add android`
* Clone a copy of audiowand into the application directory (not www)
  * `git clone https://github.com/rogerhyam/audiowand`
* Copy the `update_core.sh` script from the cloned repository to your Cordova project directory and run it.
  * `cp audiowand/update_core.sh .`
  * `chmod +x update_core.sh`
  * `./update_core.sh`
* (You can run the update_core script anytime you think the git repository might have changed)
* Initialise your data directory with the test data from the core build. You only want to do this once at the beginning!
  * `cp -r audiowand/data/* www/data`
* Get a copy of the config.xml in the www and remove the Cordova one. We use one in the WWW to make it simpler with Phonegap 
  * `rm config.xml`
  * `cp audiowand/config.xml www/config.xml`
  * `ln -s www/config.xml config.xml`
* Build it e.g.
  * `cordova build android`
* We are now free to change anything under `www/data` and the `www/config.xml`. Other files will be overwritten by `update_core.sh`

Cordova Plugins Required
========================
* com.cordova.background-audio 1.0.0 "background-audio"
* cordova-plugin-device 1.0.1 "Device"
* cordova-plugin-file 3.0.0 "File"
* cordova-plugin-geolocation 1.0.1 "Geolocation"
* cordova-plugin-inappbrowser 1.0.1 "InAppBrowser"
* cordova-plugin-media 1.0.1 "Media"
* cordova-plugin-splashscreen 2.1.0 "Splashscreen"
* cordova-plugin-statusbar 1.0.1 "StatusBar"

Useful for Debug
================
```
cd /Users/rogerhyam/android-sdks/platform-tools
./adb  logcat CordovaLog:D *:S

adb shell screenrecord /sdcard/movie.mp4
(Press Ctrl-C to stop)
adb pull /sdcard/movie.mp4
```

Creating Synthesised Voice on a Mac
===================================
There is a directory in www/data/script that can be used for managing the audio scripts. There is a bash script in there for generating synthetic voice for testing on a mac.

Voice Synthesis on Ubuntu
==========================

You need the package `libttspico-utils`, and possibly a bash file containing:
```
pico2wave -l=en-GB -w lookdave.wav "$1"
./lookdave.sh "$(cat lookdave.txt)"
```

Building the icons and splash screens
=====================================

Create a icon.png that is 512px by 512px in the www/data/images dir - this is used for Google Play store

Create a splash.jpg that is 1500 by 1500 in the www/data/images dir

The splash can just be the icon on a bigger canvas.

```
$ cd audiowand/tools/
$ ./generate_icons.sh
```

This is mac only as it uses sips.

res/ios and res/android folders and contents will be created

Also for google play Store need:

*  Feature Graphic - 1024w x 500h 
*  Promo Graphic - 180 w x 120 h

These are stored in the Dropbox folder for the app

Building an Android App for Deploy
==================================

This guide is useful

http://ionicframework.com/docs/guide/publishing.html

Run the Android sdk manager thing to make sure you are up to date

/Users/rogerhyam/android-sdks/tools/android

Make sure it is all up to date

```
$ sudo npm update -g cordova
$ cordova platform update android
```

Build it to release grade

```
$ cordova build --release android
```

Most data dealing with keys goes in the same directory. We call it for ease
of use `KEYSTOREDIR`. The location on your system will be something else, of
course.

`export KEYSTOREDIR=/Users/rogerhyam/Dropbox/RBGE/apps/deploy/android`

You need a key

```
keytool -genkey -v -keystore $KEYSTOREDIR/<appname>.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
```

You need to sign each apk file you generate. The following are a couple of examples. Adapt them to your needs, or copy them verbatim if they apply to you.

`jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $KEYSTOREDIR/`<appname>`.keystore `MainActivity`-release-unsigned.apk `alias_name

```
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $KEYSTOREDIR/audiowand-dawyck-trees.keystore android-release-unsigned.apk dawyckscottishtrees

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $KEYSTOREDIR/water-of-leith-walkway.keystore android-release-unsigned.apk waterofleithwalkway

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $KEYSTOREDIR/tenbreathsmap.keystore android-release-unsigned.apk tenbreathsmap

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $KEYSTOREDIR/nepalplants.keystore android-release-unsigned.apk nepalplants
```

zipalign it for efficiency and also to rename it

`zipalign -v 4 MainActivity-release-unsigned.apk BirdsOfPeramagroon1.0.apk`

`zipalign -v 4 android-release-unsigned.apk NepalPlants.1.0.0.apk`

(This is useful `keytool -list -keystore $KEYSTOREDIR/<**>.keystore` )

Building an iOS App for Deploy
==============================

$ cordova platform update ios




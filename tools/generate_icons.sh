
# root directory for all the outputs
mkdir ../../res

# Android ICONS
mkdir ../../res/android

sips -z 36 36 "../../www/data/images/icon.png"  --out "../../res/android/icon_ldpi.png" 
sips -z 48 48 "../../www/data/images/icon.png"  --out "../../res/android/icon_mdpi.png"
sips -z 64 64 "../../www/data/images/icon.png"  --out "../../res/android/icon_tvdpi.png"
sips -z 72 72 "../../www/data/images/icon.png"  --out "../../res/android/icon_hdpi.png"
sips -z 96 96 "../../www/data/images/icon.png"  --out "../../res/android/icon_xhdpi.png"
sips -z 144 144 "../../www/data/images/icon.png"  --out "../../res/android/icon_xxhdpi.png"
sips -z 192 192 "../../www/data/images/icon.png"  --out "../../res/android/icon_xxxhdpi.png"
sips -z 500 500 "../../www/data/images/icon.png"  --out "../../res/android/icon_app_store.png"

# Android splash
sips -z 320 320 --setProperty format png "../../www/data/images/splash.jpg"  --out "../../res/android/splash_ldpi.png"
sips -c 320 200 "../../res/android/splash_ldpi.png"  --out "../../res/android/splash_ldpi_portrait.png"
sips -c 200 320 "../../res/android/splash_ldpi.png"  --out "../../res/android/splash_ldpi_landscape.png"
rm "../../res/android/splash_ldpi.png"

sips -z 480 480 --setProperty format png "../../www/data/images/splash.jpg"  --out "../../res/android/splash_mdpi.png"
sips -c 480 320 "../../res/android/splash_mdpi.png"  --out "../../res/android/splash_mdpi_portrait.png"
sips -c 320 480 "../../res/android/splash_mdpi.png"  --out "../../res/android/splash_mdpi_landscape.png"
rm "../../res/android/splash_mdpi.png"

sips -z 800 800 --setProperty format png "../../www/data/images/splash.jpg"  --out "../../res/android/splash_hdpi.png"
sips -c 800 480 "../../res/android/splash_hdpi.png"  --out "../../res/android/splash_hdpi_portrait.png"
sips -c 480 800 "../../res/android/splash_hdpi.png"  --out "../../res/android/splash_hdpi_landscape.png"
rm "../../res/android/splash_hdpi.png"

sips -z 1280 1280 --setProperty format png "../../www/data/images/splash.jpg"  --out "../../res/android/splash_xhdpi.png"
sips -c 1280 720 "../../res/android/splash_xhdpi.png"  --out "../../res/android/splash_xhdpi_portrait.png"
sips -c 720 1280 "../../res/android/splash_xhdpi.png"  --out "../../res/android/splash_xhdpi_landscape.png"
rm "../../res/android/splash_xhdpi.png"

# iOS ICONS
mkdir ../../res/ios
sips -z 1024 1024 "../../www/data/images/icon.png"  --out "../../res/ios/icon_app_store.png"
sips -z 180 180 "../../www/data/images/icon.png"  --out "../../res/ios/icon-60@3x.png"
sips -z 120 120 "../../www/data/images/icon.png"  --out "../../res/ios/icon-60@2x.png"
sips -z 76 76 "../../www/data/images/icon.png"  --out "../../res/ios/icon-76.png"
sips -z 152 152 "../../www/data/images/icon.png"  --out "../../res/ios/icon-76@2x.png"
sips -z 80 80 "../../www/data/images/icon.png"  --out "../../res/ios/icon-40@2x.png"
sips -z 57 57 "../../www/data/images/icon.png"  --out "../../res/ios/icon-57.png"
sips -z 114 114 "../../www/data/images/icon.png"  --out "../../res/ios/icon-57@2x.png"
sips -z 72 72 "../../www/data/images/icon.png"  --out "../../res/ios/icon-72.png"
sips -z 29 29 "../../www/data/images/icon.png"  --out "../../res/ios/icon-small.png"
sips -z 58 58 "../../www/data/images/icon.png"  --out "../../res/ios/icon-small@2x.png"
sips -z 50 50 "../../www/data/images/icon.png"  --out "../../res/ios/icon-50.png"
sips -z 100 100 "../../www/data/images/icon.png"  --out "../../res/ios/icon-50@2x.png"
sips -z 40 40 "../../www/data/images/icon.png"  --out "../../res/ios/icon-40.png"
sips -z 60 60 "../../www/data/images/icon.png"  --out "../../res/ios/icon-60.png"
sips -z 144 144 "../../www/data/images/icon.png"  --out "../../res/ios/icon-72@2x.png"


# iOS splash
sips -z 480 480 --setProperty format png "../../www/data/images/splash.jpg"  --out "../../res/ios/working.png"
sips -c 480 320 "../../res/ios/working.png"  --out "../../res/ios/Default~iphone.png"
rm "../../res/ios/working.png"

sips -z 960 960 --setProperty format png "../../www/data/images/splash.jpg"  --out "../../res/ios/working.png"
sips -c 960 640 "../../res/ios/working.png"  --out "../../res/ios/Default@2x~iphone.png"
rm "../../res/ios/working.png"

sips -z 1024 1024 --setProperty format png "../../www/data/images/splash.jpg"  --out "../../res/ios/working.png"
sips -c 768 1024 "../../res/ios/working.png"  --out "../../res/ios/Default-Landscape~ipad.png"
sips -c 1024 768 "../../res/ios/working.png"  --out "../../res/ios/Default-Portrait~ipad.png"
rm "../../res/ios/working.png"

sips -z 2048 2048 --setProperty format png "../../www/data/images/splash.jpg"  --out "../../res/ios/working.png"
sips -c 1536 2048 "../../res/ios/working.png"  --out "../../res/ios/Default-Landscape~ipad.png"
sips -c 2048 1536 "../../res/ios/working.png"  --out "../../res/ios/Default-Portrait~ipad.png"
rm "../../res/ios/working.png"

sips -z 2048 2048 --setProperty format png "../../www/data/images/splash.jpg"  --out "../../res/ios/working.png"
sips -c 1536 2048 "../../res/ios/working.png"  --out "../../res/ios/Default-Landscape@2x~ipad.png"
sips -c 2048 1536 "../../res/ios/working.png"  --out "../../res/ios/Default-Portrait@2x~ipad.png"
rm "../../res/ios/working.png"

sips -z 1136 1136 --setProperty format png "../../www/data/images/splash.jpg"  --out "../../res/ios/working.png"
sips -c 1136 640 "../../res/ios/working.png"  --out "../../res/ios/Default-568h@2x~iphone.png"
rm "../../res/ios/working.png"

sips -z 1334 1334 --setProperty format png "../../www/data/images/splash.jpg"  --out "../../res/ios/working.png"
sips -c 1334 750 "../../res/ios/working.png"  --out "../../res/ios/Default-667h.png"
rm "../../res/ios/working.png"

sips -z 2208 2208 --setProperty format png "../../www/data/images/splash.jpg"  --out "../../res/ios/working.png"
sips -c 2208 1242 "../../res/ios/working.png"  --out "../../res/ios/Default-736h.png"
sips -c 1242 2208 "../../res/ios/working.png"  --out "../../res/ios/Default-Landscape-736h.png"
rm "../../res/ios/working.png"



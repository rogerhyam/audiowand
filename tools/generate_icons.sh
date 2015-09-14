
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









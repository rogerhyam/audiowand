
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








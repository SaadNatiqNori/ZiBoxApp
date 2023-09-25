# ZiBox
## How to add Android or iOS platform to Project:
**Android**
```javascript
ionic capacitor add android
```
**iOS**
```javascript
ionic capacitor add ios
```
----------
## Open the IDE for a given native platform project:
**Open Default IDE**
```javascript
ionic capacitor open
```
**Android**
```javascript
ionic capacitor open android
```
**iOS**
```javascript
ionic capacitor open ios
```
----------
## How to Build project for Android or iOS:
**Android**
```javascript
ionic capacitor build android
```
**iOS**
```javascript
ionic capacitor build ios
```
----------
## How to Change App versions:
**Android**
```javascript
capacitor-set-version set:android -v 6.4.6 -b 604060
```
**iOS**
```javascript
capacitor-set-version set:ios -v 6.4.6 -b 604060
```
**Note.**
```javascript
OPTIONS
  -b, --build=10       App build number (Integer)
  -v, --version=x.x.x  App version
```
----------
## Run an Ionic project on a connected device:
**Android**
```javascript
ionic capacitor run android -l --external
```
```javascript
ionic capacitor run ios --livereload --external
```
**iOS**
```javascript
ionic capacitor run ios --livereload-url=http://localhost:8100
```

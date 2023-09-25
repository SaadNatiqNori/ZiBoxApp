import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ionicframework.zitrade271041',
  appName: 'ZiBox',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '691527637295-280dl992d8h6uqtajbv094h1k5c4dn48.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;

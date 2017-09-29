cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "id": "cordova-plugin-fcm.FCMPlugin",
        "file": "plugins/cordova-plugin-fcm/www/FCMPlugin.js",
        "pluginId": "cordova-plugin-fcm",
        "clobbers": [
            "FCMPlugin"
        ]
    },
    {
        "id": "cordova-plugin-velda-devicefeedback.DeviceFeedback",
        "file": "plugins/cordova-plugin-velda-devicefeedback/DeviceFeedback.js",
        "pluginId": "cordova-plugin-velda-devicefeedback",
        "clobbers": [
            "window.plugins.deviceFeedback"
        ]
    },
    {
        "id": "cordova-plugin-photos.Photos",
        "file": "plugins/cordova-plugin-photos/www/Photos.js",
        "pluginId": "cordova-plugin-photos",
        "clobbers": [
            "Photos"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.2",
    "cordova-plugin-inappbrowser": "1.7.1",
    "cordova-plugin-fcm": "2.1.2",
    "cordova-plugin-velda-devicefeedback": "0.0.2",
    "cordova-plugin-compat": "1.0.0",
    "cordova-plugin-photos": "1.0.8"
};
// BOTTOM OF METADATA
});
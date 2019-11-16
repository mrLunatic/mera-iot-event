cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-ble.BLE",
      "file": "plugins/cordova-plugin-ble/ble.js",
      "pluginId": "cordova-plugin-ble",
      "clobbers": [
        "evothings.ble"
      ]
    },
    {
      "id": "cordova-plugin-eddystone.eddystoneplugin",
      "file": "plugins/cordova-plugin-eddystone/js/eddystone-plugin.js",
      "pluginId": "cordova-plugin-eddystone",
      "clobbers": [
        "evothings.eddystone"
      ]
    },
    {
      "id": "cordova-plugin-mqtt.MQTTEmitter",
      "file": "plugins/cordova-plugin-mqtt/www/MQTTEmitter.js",
      "pluginId": "cordova-plugin-mqtt",
      "clobbers": [
        "ME"
      ]
    },
    {
      "id": "cordova-plugin-mqtt.CordovaMqTTPlugin",
      "file": "plugins/cordova-plugin-mqtt/www/cordova-plugin-mqtt.js",
      "pluginId": "cordova-plugin-mqtt",
      "clobbers": [
        "cordova.plugins.CordovaMqTTPlugin"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.4",
    "cordova-plugin-ble": "2.0.1",
    "cordova-plugin-eddystone": "1.3.0",
    "cordova-plugin-mqtt": "0.3.8"
  };
});
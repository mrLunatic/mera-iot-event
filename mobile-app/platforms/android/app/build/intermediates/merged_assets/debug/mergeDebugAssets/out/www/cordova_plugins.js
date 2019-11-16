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
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.4",
    "cordova-plugin-ble": "2.0.1",
    "cordova-plugin-eddystone": "1.3.0"
  };
});
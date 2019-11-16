/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

(function()
{
    // Dictionary of beacons.
    var beacons = {};
    // Timer that displays list of beacons.
    var timer = null;
    function onDeviceReady()
    {
        // Start tracking beacons!
        setTimeout(startScan, 500);
        // Timer that refreshes the display.
        timer = setInterval(updateBeaconList, 500);
    }
    function onBackButtonDown()
    {
        evothings.eddystone.stopScan();
        navigator.app.exitApp();
    }
    function startScan()
    {
        showMessage('Scan in progress.');
        evothings.eddystone.startScan(
            function(beacon)
            {
                // Update beacon data.
                beacon.timeStamp = Date.now();
                beacons[beacon.address] = beacon;
            },
            function(error)
            {
                showMessage('Eddystone scan error: ' + error);
            });
    }
    // Map the RSSI value to a value between 1 and 100.
    function mapBeaconRSSI(rssi)
    {
        if (rssi >= 0) return 1; // Unknown RSSI maps to 1.
        if (rssi < -100) return 100; // Max RSSI
        return 100 + rssi;
    }
    function getSortedBeaconList(beacons)
    {
        var beaconList = [];
        for (var key in beacons)
        {
            beaconList.push(beacons[key]);
        }
        beaconList.sort(function(beacon1, beacon2)
        {
            return mapBeaconRSSI(beacon1.rssi) < mapBeaconRSSI(beacon2.rssi);
        });
        return beaconList;
    }
    function updateBeaconList()
    {
        removeOldBeacons();
        displayBeacons();
    }
    function removeOldBeacons()
    {
        var timeNow = Date.now();
        for (var key in beacons)
        {
            // Only show beacons updated during the last 60 seconds.
            var beacon = beacons[key];
            if (beacon.timeStamp + 60000 < timeNow)
            {
                delete beacons[key];
            }
        }
    }
    function displayBeacons()
    {
        var html = '';
        var sortedList = getSortedBeaconList(beacons);
        for (var i = 0; i < sortedList.length; ++i)
        {
            var beacon = sortedList[i];
            var htmlBeacon =
                '<p>'
                +	htmlBeaconName(beacon)
                +	htmlBeaconURL(beacon)
                +	htmlBeaconNID(beacon)
                +	htmlBeaconBID(beacon)
                +	htmlBeaconEID(beacon)
                +	htmlBeaconVoltage(beacon)
                +	htmlBeaconTemperature(beacon)
                +	htmlBeaconRSSI(beacon)
                + '</p>';
            html += htmlBeacon
        }
        document.querySelector('#found-beacons').innerHTML = html;
    }
    function htmlBeaconName(beacon)
    {
        var name = beacon.name || 'no name';
        return '<strong>' + name + '</strong><br/>';
    }
    function htmlBeaconURL(beacon)
    {
        return beacon.url ?
            'URL: ' + beacon.url + '<br/>' :  '';
    }
    function htmlBeaconURL(beacon)
    {
        return beacon.url ?
            'URL: ' + beacon.url + '<br/>' :  '';
    }
    function htmlBeaconNID(beacon)
    {
        return beacon.nid ?
            'NID: ' + uint8ArrayToString(beacon.nid) + '<br/>' :  '';
    }
    function htmlBeaconBID(beacon)
    {
        return beacon.bid ?
            'BID: ' + uint8ArrayToString(beacon.bid) + '<br/>' :  '';
    }
    function htmlBeaconEID(beacon)
    {
        return beacon.eid ?
            'EID: ' + uint8ArrayToString(beacon.eid) + '<br/>' :  '';
    }
    function htmlBeaconVoltage(beacon)
    {
        return beacon.voltage ?
            'Voltage: ' + beacon.voltage + '<br/>' :  '';
    }
    function htmlBeaconTemperature(beacon)
    {
        return beacon.temperature && beacon.temperature != 0x8000 ?
            'Temperature: ' + beacon.temperature + '<br/>' :  '';
    }
    function htmlBeaconRSSI(beacon)
    {
        return beacon.rssi ?
            'RSSI: ' + beacon.rssi + '<br/>' :  '';
    }
    function uint8ArrayToString(uint8Array)
    {
        function format(x)
        {
            var hex = x.toString(16);
            return hex.length < 2 ? '0' + hex : hex;
        }
        var result = '';
        for (var i = 0; i < uint8Array.length; ++i)
        {
            result += format(uint8Array[i]) + ' ';
        }
        return result;
    }
    function showMessage(text)
    {
        document.querySelector('#message').innerHTML = text;
    }
    // This calls onDeviceReady when Cordova has loaded everything.
    document.addEventListener('deviceready', onDeviceReady, false);
    // Add back button listener (for Android).
    document.addEventListener('backbutton', onBackButtonDown, false);
})();

(function() {
    cordova.plugins.CordovaMqTTPlugin.connect({
        url:"tcp://test.mosquitto.org", //a public broker used for testing purposes only. Try using a self hosted broker for production.
        port:1883,
        clientId:"YOUR_USER_ID_LESS_THAN_24_CHARS",
        connectionTimeout:3000,
        willTopicConfig:{
            qos:0, //default is 0
            retain:true, //default is true
            topic:"<will topic>",
            payload:"<will topic message>"
        },
        username:"uname",
        password:'pass',
        keepAlive:60,
        isBinaryPayload: false, //setting this 'true' will make plugin treat all data as binary and emit ArrayBuffer instead of string on events
        success:function(s){
            console.log("connect success");
        },
        error:function(e){
            console.log("connect error");
        },
        onConnectionLost:function (){
            console.log("disconnect");
        },
        routerConfig:{
            router:routerObject, //instantiated router object
            publishMethod:"emit", //refer your custom router documentation to get the emitter/publishing function name. The parameter should be a string and not a function.
            useDefaultRouter:false //Set false to use your own topic router implementation. Set true to use the stock topic router implemented in the plugin.
        }
    })
})()
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_1 = __importDefault(require("mqtt"));
const Calc_1 = require("./Calc");
const client = mqtt_1.default.connect("tcp://broker.hivemq.com:1883");
const beacons = new Map();
client.on('connect', function () {
    client.subscribe('iot-hub-kzn', function (err) {
        //   if (!err) {
        //     client.publish('presence', 'Hello mqtt')
        //   }
    });
});
client.on('message', function (topic, message) {
    const packet = JSON.parse(message.toString());
    console.log(`MobileId: ${packet.mobileId}`);
    for (const beacon of packet.advertisingPacketList) {
        console.log(`b: ${beacon.beaconId}, x: ${beacon.xCoord}, y: ${beacon.yCoord} d: ${calcDistance(beacon)}`);
    }
    const circles = packet.advertisingPacketList.map(p => {
        return {
            center: new Calc_1.Point(p.xCoord, p.yCoord),
            r: calcDistance(p)
        };
    });
    const point = Calc_1.calculatePoint(circles.filter(p => p.r < 10));
    if (point !== null) {
        console.log(`mobile: ${point.x} : ${point.y}`);
    }
    // console.log(JSON.stringify(JSON.parse(message.toString()), undefined, 2))
});
function calcDistance(b) {
    const pathLoss = 2;
    const shift = -41;
    let d = Math.pow(10, (b.txPower + shift - b.rssi) / (10 * pathLoss));
    const prev = beacons.get(b.beaconId);
    if (prev !== undefined) {
        const dt = b.timestamp - prev.date;
        const coef = dt < 500
            ? 0.35
            : dt < 1000
                ? 0.55
                : 1;
        console.log(`ema coef: ${coef}`);
        d = ema(d, prev.value, coef);
    }
    beacons.set(b.beaconId, {
        date: b.timestamp,
        value: d
    });
    return d;
}
function ema(next, prev, coef) {
    return (coef * next) + (1 - coef) * prev;
}
//# sourceMappingURL=index.js.map
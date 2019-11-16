import mqtt from "mqtt";
import { Circle, Point, calculatePoint } from "./Calc";
const client = mqtt.connect("tcp://broker.hivemq.com:1883");
type MqttPacker = {
    mobileId: string;
    advertisingPacketList: Array<BeaconData>;
};
type BeaconData = {
    addressId: string,
    beaconId: number,
    namespaceId: string,
    rssi: number,
    timestamp: number,
    txPower: number,
    xCoord: number,
    yCoord: number,
};

const beacons = new Map<number, {
    value: number,
    date: number,
}>();
client.on('connect', function () {
    client.subscribe('iot-hub-kzn', function (err) {
    //   if (!err) {
    //     client.publish('presence', 'Hello mqtt')
    //   }
    })
  })
   
  client.on('message', function (topic, message) {
    const packet: MqttPacker = JSON.parse(message.toString());
    console.log(`MobileId: ${packet.mobileId}`);
    const circles: Array<Circle> = packet.advertisingPacketList.map(p => {
        return {
            center: new Point(p.xCoord, p.yCoord),
            r: calcDistance(p)
        } as Circle;
    });
    const point = calculatePoint(circles.filter(p => p.r < 10));
    if (point !== null) {
        // client.publish("iot-hub-kzn", { point: point })
        console.log(`mobile: ${point.x} : ${point.y}`);
    } 
    // console.log(JSON.stringify(JSON.parse(message.toString()), undefined, 2))
  });
function calcDistance(b: BeaconData): number {
    const pathLoss = 2;
    const shift = - 41;
    let d = Math.pow(10, (b.txPower + shift  - b.rssi) / (10 * pathLoss ))
    const prev = beacons.get(b.beaconId);
    if (prev !== undefined) {
        const dt = b.timestamp -  prev.date;
        const coef = dt < 500
            ? 0.35
            : dt < 1000
                ? 0.55
                : 1

                console.log(`ema coef: ${coef}`)
        d = ema(d, prev.value, coef);
    }
    beacons.set(b.beaconId, {
        date: b.timestamp,
        value: d
    });
    return d;
}
function ema(next: number, prev: number, coef: number): number {
    return (coef * next) + (1 - coef) * prev;
}

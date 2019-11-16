export class Point {
    x: number;
    y: number;
    /**
     *
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    plus(p: Point) {
        return new Point(this.x + p.x, this.y + p.y);
    }
    minus(p: Point) {
        return new Point(this.x - p.x, this.y - p.y);
    }
    scale(scale: number) {
        return new Point(this.x * scale, this.y * scale);
    }
    equals(p: Point): boolean {
        return this.x === p.x && this.y === p.y;
    }
};
export type Circle = { center: Point, r: number}

const circles: Array<Circle> = [
    {
        center: new Point(0,0),
        r: 42
    },
    {
        center: new Point(-10,58),
        r: 54
    },
    {
        center: new Point(69,42),
        r: 44
    },
    {
        center: new Point(80,4),
        r: 64
    }
]

function lenght(a: Point, b: Point): number {
    const d = {
        x: b.x - a.x,
        y: b.y - a.y
    };
    return Math.sqrt(d.x * d.x + d.y * d.y);
}

function intersection(ca: Circle, cb: Circle): Array<Point> {
    const d = lenght(ca.center, cb.center);
    const a = (ca.r * ca.r - cb.r * cb.r + d * d) / (2 * d);
    const h = Math.sqrt(ca.r * ca.r - a * a);
    if (isNaN(h)) {
        return []
    }
    const p1 = ca.center;
    const p2 = cb.center;
    const p30 = p2.minus(p1);
    const p31 = p30.scale(a / d);
    const p3 = p1.plus(p31);
    const p4 = new Point(
        p3.x + (h / d) *(p2.y - p1.y),
        p3.y - (h / d) * (p2.x - p1.x)
    );
    const p5 = new Point(
        p3.x - (h / d) *(p2.y - p1.y),
        p3.y + (h / d) * (p2.x - p1.x)
    );
    if (p4.equals(p5)) {
        return [
            p4
        ]
    } else {
    return [
        p4, p5
    ]}

}

export function calculatePoint(circles: Array<Circle>): Point | null {
    const points = new Array<Point>();
    for (let i = 0; i < circles.length; i++) {
        const ci = circles[i];
        for (let j = i; j < circles.length; j++) {
            const cj = circles[j];
            const i = intersection(ci, cj);
            switch(i.length) {
                case 1: {
                    points.push(...intersection(ci, cj));
                    break;
                }
                case 2: {
                    const p1 = i[0];
                    const p2 = i[1];
                    points.push(p1.plus(p2.minus(p1).scale(0.33)));
                    points.push(p1.plus(p2.minus(p1).scale(0.5)));
                    points.push(p1.plus(p2.minus(p1).scale(0.66)));
                    break;
                }
            }
            
        }
    }

    if (points.length === 0) {
        return null;
    }
    const count = points.length;
    let target = points.splice(0, 1)[0];
    for (const p of points) {
        target = target.plus(p);
    }
    target = target.scale(1 / count);
    return target;
}


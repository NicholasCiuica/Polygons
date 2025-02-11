const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

noise.seed(Math.random());

// class Vector {
//     constructor(x, y, z) {
//         this.x = x;
//         this.y = y;
//         this.z = z;
//     }
//     magnitude() {
//         return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
//     }
//     scalarDivide(c) {
//         this.x /= c;
//         this.y /= c;
//         this.z /= c;
//     }
//     normalize() {
//         this.scalarDivide(this.magnitude);
//     }
// }

function vectorNormalize(v) {
    const magnitude = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
    if(magnitude == 0) {
        return {x: 0, y: 0, z: 0};
    }
    return {
        x: v.x / magnitude,
        y: v.y / magnitude,
        z: v.z / magnitude
    }
}

function vectorSubtract(v1, v2) {
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y,
        z: v1.z - v2.z
    };
}

function vectorScalarMultiply(v, c) {
    return {
        x: v.x * c,
        y: v.y * c,
        z: v.z * c
    }
}

function vectorDotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

function vectorCrossProduct(v1, v2) {
    return {
        x: v1.y * v2.z - v1.z * v2.y,
        y: v1.z * v2.x - v1.x * v2.z,
        z: v1.x * v2.y - v1.y * v2.x
    };
}

function drawPolygon(ctx, points, color) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.stroke();
}

class Point {
    constructor(x, y, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class PointGrid {
    constructor(unitSize) {
        this.unitSize = unitSize;
        this.numRows = canvas.height / unitSize + 2;
        this.numCols = canvas.width / unitSize + 2;
        this.points = [];
        this.createGrid();
    }
    createGrid() {
        for(let r = 0; r < this.numRows; r++) {
            const row = [];
            for(let c = 0; c < this.numCols; c++) {
                let x = (c - 1) * this.unitSize + Math.random() * this.unitSize * 0.75;
                let y = (r - 1) * this.unitSize + Math.random() * this.unitSize * 0.75;
                let z = 25 * Math.sin(y / 200 * Math.PI) * Math.sin(x / 200 * Math.PI) + 25 * Math.random();
                let p = new Point(x, y, z);
                row.push(p);
            }
            this.points.push(row);
        }
    }
}

class Polygon {
    constructor(points, color) {
        if(points.length < 3) {
            throw new Error('Tried to make a polygon with only ' + points.length + ' vertices');
        }
        this.points = points;
        this.color = color;
        this.forwardUnitNormal = this.calculateForwardUnitNormal();
    }
    draw(ctx) {
        drawPolygon(ctx, this.points, this.color);
    }
    calculateForwardUnitNormal() {
        const p = this.points;
        const v1 = vectorSubtract(p[1], p[0]);
        const v2 = vectorSubtract(p[2], p[0]);
        const normal = vectorCrossProduct(v1, v2);
        let unitNormal = vectorNormalize(normal);
        if(unitNormal.z < 0) {
            unitNormal = vectorScalarMultiply(unitNormal, -1);
        }
        return unitNormal;
    }
    getCenter() {
        const center = {x: 0, y: 0, z: 0};
        for(let point of this.points) {
            center.x += point.x;
            center.y += point.y;
            center.z += point.z;
        }
        center.x /= this.points.length;
        center.y /= this.points.length;
        center.z /= this.points.length;
        return center;
    }
    distanceFrom(point) {
        const center = this.getCenter();
        const deltaX = point.x - center.x;
        const deltaY = point.y - center.y;
        const deltaZ = point.z - center.z;
        return Math.sqrt(deltaX ** 2 + deltaY ** 2 + deltaZ ** 2);
    }
    unitVectorTo(point) {
        const center = this.getCenter();
        const v = vectorSubtract(point, center);
        return vectorNormalize(v);
    }
}

class Effect {
    constructor(unitSize) {
        this.pointGrid = new PointGrid(unitSize);
        this.polygons = [];
        this.createPolygons();
    }
    createPolygons() {
        //this.polygons.push(new Polygon([new Point(100, 100, 0), new Point(200, 100, 0), new Point(100, 200, 0)], "color"));
        let g = this.pointGrid.points;
        for(let r = 0; r < this.pointGrid.numRows - 1; r++) {
            for(let c = 0; c < this.pointGrid.numCols - 1; c++) {
                let u, v;
                if((r + c) % 2 == 0) {
                    u = [{r: 0, c: 0}, {r: 1, c: 0}, {r: 0, c: 1}];
                    v = [{r: 1, c: 1}, {r: 1, c: 0}, {r: 0, c: 1}];
                } else {
                    u = [{r: 0, c: 1}, {r: 0, c: 0}, {r: 1, c: 1}];
                    v = [{r: 1, c: 0}, {r: 0, c: 0}, {r: 1, c: 1}];
                }
                let points = [];
                points.push(g[r + u[0].r][c + u[0].c]);
                points.push(g[r + u[1].r][c + u[1].c]);
                points.push(g[r + u[2].r][c + u[2].c]);
                this.polygons.push(new Polygon(points, "orange"));
                points = [];
                points.push(g[r + v[0].r][c + v[0].c]);
                points.push(g[r + v[1].r][c + v[1].c]);
                points.push(g[r + v[2].r][c + v[2].c]);
                this.polygons.push(new Polygon(points, "orange"));
            }   
        }
    }
    update() {
        let radius = 200;
        for(let polygon of this.polygons) {
            //const deltaAngle = Math.abs(polygon.angle - polygon.angleTo(pointLight));
            //const angleBetween = Math.min(deltaAngle, Math.PI * 2 - deltaAngle);
            //const angleMagnitude = angleBetween / Math.PI;

            const dotProduct = vectorDotProduct(polygon.forwardUnitNormal, polygon.unitVectorTo(pointLight));
            const reflectionMagnitude = Math.max(dotProduct, 0);
            const distanceMagnitude = Math.max(radius - polygon.distanceFrom(pointLight), 0) / radius;
            const hueMagnitude = 0.2 * reflectionMagnitude + 0.8 * distanceMagnitude;
            const lightnessMagnitude = 0.8 * reflectionMagnitude + 0.2 * distanceMagnitude;
    
            const baseHue = 280 + 60 * noise.perlin3(polygon.getCenter().x / 1000 * 2, polygon.getCenter().y / 1000 * 2, Date.now() / 1000 / 2);
            const hue = baseHue + hueMagnitude * 75;
            const lightness = 50 + lightnessMagnitude * 50;
            const color = `hsla(${hue}, 100%, ${lightness}%, 1)`;
            polygon.color = color;
            polygon.draw(ctx);
        }
    }
}

let effect = new Effect(60);

const mouse = {x: 0, y: 0};
const pointLight = new Point(0, 0, 100);

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});
window.addEventListener('touchmove', (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
});

let initialFrameTime = Date.now();

function animate() {
    const currentTime = Date.now();
    const deltaTime = currentTime - initialFrameTime;
    initialFrameTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    effect.update();

    pointLight.x += (mouse.x - pointLight.x) / 6;
    pointLight.y += (mouse.y - pointLight.y) / 6;

    requestAnimationFrame(animate);
}
animate();
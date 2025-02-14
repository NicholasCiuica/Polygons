const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

noise.seed(Math.random());

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
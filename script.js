// K-Means Clustering Demo (Vanilla JS)

const canvas = document.getElementById('kmeans-canvas');
const ctx = canvas.getContext('2d');
const kSelect = document.getElementById('k-select');
const assignBtn = document.getElementById('assign-btn');
const moveBtn = document.getElementById('move-btn');
const restartBtn = document.getElementById('restart-btn');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const POINT_RADIUS = 5;
const CENTROID_RADIUS = 8;
const COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'];

let points = [];
let centroids = [];
let assignments = [];
let k = parseInt(kSelect.value);

function randomPoint() {
    return {
        x: Math.random() * (WIDTH - 40) + 20,
        y: Math.random() * (HEIGHT - 40) + 20
    };
}

function generatePoints(n = 40) {
    points = [];
    for (let i = 0; i < n; i++) {
        points.push(randomPoint());
    }
}

function generateCentroids() {
    centroids = [];
    for (let i = 0; i < k; i++) {
        centroids.push(randomPoint());
    }
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    // Draw lines if assigned
    if (assignments.length === points.length) {
        for (let i = 0; i < points.length; i++) {
            const c = centroids[assignments[i]];
            ctx.strokeStyle = COLORS[assignments[i] % COLORS.length];
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(c.x, c.y);
            ctx.stroke();
        }
    }
    // Draw points
    for (let i = 0; i < points.length; i++) {
        ctx.fillStyle = assignments.length === points.length ? COLORS[assignments[i] % COLORS.length] : '#333';
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, POINT_RADIUS, 0, 2 * Math.PI);
        ctx.fill();
    }
    // Draw centroids
    for (let i = 0; i < centroids.length; i++) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(centroids[i].x, centroids[i].y, CENTROID_RADIUS, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    ctx.lineWidth = 1;
}

function assignPoints() {
    assignments = [];
    for (let i = 0; i < points.length; i++) {
        let minDist = Infinity;
        let minIdx = 0;
        for (let j = 0; j < centroids.length; j++) {
            const dx = points[i].x - centroids[j].x;
            const dy = points[i].y - centroids[j].y;
            const dist = dx * dx + dy * dy;
            if (dist < minDist) {
                minDist = dist;
                minIdx = j;
            }
        }
        assignments.push(minIdx);
    }
}

function moveCentroids() {
    let sums = Array(k).fill(0).map(() => ({x:0, y:0, count:0}));
    for (let i = 0; i < points.length; i++) {
        const idx = assignments[i];
        sums[idx].x += points[i].x;
        sums[idx].y += points[i].y;
        sums[idx].count++;
    }
    for (let i = 0; i < k; i++) {
        if (sums[i].count > 0) {
            centroids[i].x = sums[i].x / sums[i].count;
            centroids[i].y = sums[i].y / sums[i].count;
        }
    }
}

function restart() {
    generatePoints();
    centroids = [];
    assignments = [];
    draw();
}

kSelect.addEventListener('change', () => {
    k = parseInt(kSelect.value);
    generateCentroids();
    assignments = [];
    draw();
});

assignBtn.addEventListener('click', () => {
    if (centroids.length === 0) generateCentroids();
    assignPoints();
    draw();
});

moveBtn.addEventListener('click', () => {
    if (assignments.length === points.length) {
        moveCentroids();
        draw();
    }
});


restartBtn.addEventListener('click', () => {
    generatePoints();
    generateCentroids();
    assignments = [];
    draw();
});

// Initial setup
generatePoints();
generateCentroids();
assignments = [];
draw();

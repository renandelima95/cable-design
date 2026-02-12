// ========================================
// Circle Packing Module
// Optimizes wire bundle diameter
// ========================================

class CirclePacking {
    constructor(cables) {
        this.cables = cables;
        this.diameters = cables.map(c => c.nominalDiameter || c.diameter);
        this.radii = this.diameters.map(d => d / 2);
        this.n = cables.length;
    }

    checkOverlap(positions, containerRadius) {
        let penalty = 0;

        for (let i = 0; i < this.n; i++) {
            const dist = Math.sqrt(positions[i].x ** 2 + positions[i].y ** 2);
            const excess = (dist + this.radii[i]) - containerRadius;
            if (excess > 0) {
                penalty += excess ** 2 * 1000;
            }
        }

        for (let i = 0; i < this.n; i++) {
            for (let j = i + 1; j < this.n; j++) {
                const dx = positions[i].x - positions[j].x;
                const dy = positions[i].y - positions[j].y;
                const dist = Math.sqrt(dx ** 2 + dy ** 2);
                const minDist = this.radii[i] + this.radii[j];
                const overlap = minDist - dist;

                if (overlap > 0) {
                    penalty += overlap ** 2 * 1000;
                }
            }
        }

        return penalty;
    }

    estimateRadius() {
        const totalArea = this.radii.reduce((sum, r) => sum + Math.PI * r ** 2, 0);
        const estimatedRadius = Math.sqrt(totalArea / Math.PI) * 1.15;
        const maxRadius = Math.max(...this.radii);
        return Math.max(estimatedRadius, maxRadius);
    }

    randomPositions(containerRadius) {
        const positions = [];
        const maxR = containerRadius * 0.7;

        for (let i = 0; i < this.n; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const r = Math.random() * maxR;
            positions.push({
                x: r * Math.cos(angle),
                y: r * Math.sin(angle)
            });
        }
        return positions;
    }

    applyRepulsionForces(positions, containerRadius) {
        const forces = positions.map(() => ({ x: 0, y: 0 }));
        const minGap = 0.01;

        for (let i = 0; i < this.n; i++) {
            for (let j = i + 1; j < this.n; j++) {
                const dx = positions[j].x - positions[i].x;
                const dy = positions[j].y - positions[i].y;
                const dist = Math.sqrt(dx ** 2 + dy ** 2);
                const minDist = this.radii[i] + this.radii[j] + minGap;

                if (dist < minDist && dist > 0.001) {
                    const overlap = minDist - dist;
                    const force = overlap / dist;

                    forces[i].x -= dx * force * 0.5;
                    forces[i].y -= dy * force * 0.5;
                    forces[j].x += dx * force * 0.5;
                    forces[j].y += dy * force * 0.5;
                }
            }

            const distFromCenter = Math.sqrt(positions[i].x ** 2 + positions[i].y ** 2);
            const maxDist = containerRadius - this.radii[i] - minGap;

            if (distFromCenter > maxDist && distFromCenter > 0.001) {
                const excess = distFromCenter - maxDist;
                const force = excess / distFromCenter;

                forces[i].x -= positions[i].x * force;
                forces[i].y -= positions[i].y * force;
            }
        }

        for (let i = 0; i < this.n; i++) {
            positions[i].x += forces[i].x;
            positions[i].y += forces[i].y;
        }
    }

    isValidSolution(positions, containerRadius) {
        const tolerance = 1e-6;

        for (let i = 0; i < this.n; i++) {
            const dist = Math.sqrt(positions[i].x ** 2 + positions[i].y ** 2);
            if (dist + this.radii[i] > containerRadius + tolerance) {
                return false;
            }
        }

        for (let i = 0; i < this.n; i++) {
            for (let j = i + 1; j < this.n; j++) {
                const dx = positions[i].x - positions[j].x;
                const dy = positions[i].y - positions[j].y;
                const dist = Math.sqrt(dx ** 2 + dy ** 2);
                const minDist = this.radii[i] + this.radii[j];

                if (dist < minDist - tolerance) {
                    return false;
                }
            }
        }

        return true;
    }

    optimize() {
        let bestRadius = Infinity;
        let bestPositions = null;

        const trials = 15;

        for (let trial = 0; trial < trials; trial++) {
            let radius = this.estimateRadius() * 1.2;
            let positions = this.randomPositions(radius);

            for (let iter = 0; iter < 500; iter++) {
                this.applyRepulsionForces(positions, radius);

                if (iter % 50 === 0) {
                    const penalty = this.checkOverlap(positions, radius);
                    if (penalty < 0.001) break;
                }
            }

            let shrinkAttempts = 0;
            const maxShrinkAttempts = 50;

            while (shrinkAttempts < maxShrinkAttempts) {
                const testRadius = radius * 0.995;
                const testPositions = positions.map(p => ({ ...p }));

                for (let i = 0; i < 30; i++) {
                    this.applyRepulsionForces(testPositions, testRadius);
                }

                if (this.isValidSolution(testPositions, testRadius)) {
                    radius = testRadius;
                    positions = testPositions;
                    shrinkAttempts = 0;
                } else {
                    shrinkAttempts++;
                }
            }

            for (let iter = 0; iter < 100; iter++) {
                this.applyRepulsionForces(positions, radius);
            }

            if (this.isValidSolution(positions, radius)) {
                if (radius < bestRadius) {
                    bestRadius = radius;
                    bestPositions = positions.map(p => ({ ...p }));
                }
            }
        }

        if (bestPositions === null) {
            bestRadius = this.estimateRadius() * 1.5;
            bestPositions = this.randomPositions(bestRadius);

            for (let iter = 0; iter < 1000; iter++) {
                this.applyRepulsionForces(bestPositions, bestRadius);
            }

            while (!this.isValidSolution(bestPositions, bestRadius)) {
                bestRadius *= 1.05;
                for (let iter = 0; iter < 50; iter++) {
                    this.applyRepulsionForces(bestPositions, bestRadius);
                }
            }
        }

        return {
            radius: bestRadius,
            diameter: bestRadius * 2,
            positions: bestPositions
        };
    }
}

function calculateWireBundle(wires) {
    if (wires.length === 0) return { diameter: 0, circles: [] };

    if (wires.length === 1) {
        const d = wires[0].nominalDiameter || wires[0].diameter;
        return {
            diameter: d,
            circles: [{
                x: 0,
                y: 0,
                r: d / 2,
                color: wires[0].color,
                name: wires[0].name
            }]
        };
    }

    const packing = new CirclePacking(wires);
    const result = packing.optimize();

    const circles = result.positions.map((pos, i) => ({
        x: pos.x,
        y: pos.y,
        r: (wires[i].nominalDiameter || wires[i].diameter) / 2,
        color: wires[i].color,
        name: wires[i].name
    }));

    return {
        diameter: result.diameter,
        circles: circles
    };
}

function drawWireBundle(canvasEl, bundleData) {
    const ctx = canvasEl.getContext('2d');
    const centerX = canvasEl.width / 2;
    const centerY = canvasEl.height / 2;

    const scale = Math.min(canvasEl.width, canvasEl.height) / (bundleData.diameter * 1.2);

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    // Outer circle (bundle boundary)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, (bundleData.diameter / 2) * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Individual wires
    bundleData.circles.forEach(circle => {
        ctx.fillStyle = circle.color;
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(
            centerX + circle.x * scale,
            centerY + circle.y * scale,
            circle.r * scale,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            circle.name,
            centerX + circle.x * scale,
            centerY + circle.y * scale
        );
    });
}

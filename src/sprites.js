/**
 * Lo-Fi Artwork and Sprite Generator for Pranesh's Journey
 * Procedurally generates an animated cyclist, scenic road, street lamps, and pavilions.
 */

class SpriteGenerator {
    static generateAll(scene) {
        this.generateCyclist(scene);
        this.generateEnvironment(scene);
        this.generateBackgrounds(scene);
        this.registerAnimations(scene);
    }

    static createCanvas(w, h) {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        return { canvas, ctx };
    }

    // ==========================================
    // 1. CYCLIST (Pranesh riding a bicycle)
    // ==========================================
    static generateCyclist(scene) {
        const W = 64;
        const H = 48;

        // 8 frames for smooth pedaling loop
        for (let frame = 0; frame < 8; frame++) {
            const { canvas, ctx } = this.createCanvas(W, H);

            // Ground shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
            ctx.beginPath();
            ctx.ellipse(32, 45, 26, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Wheels (Radius 10)
            const rearWheelX = 14;
            const frontWheelX = 50;
            const wheelY = 35;
            const wheelR = 9;

            // Draw wheel with spinning spokes
            const drawWheel = (wx, wy) => {
                // Tire
                ctx.strokeStyle = '#1e293b';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(wx, wy, wheelR, 0, Math.PI * 2);
                ctx.stroke();

                // Rim
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(wx, wy, wheelR - 1.5, 0, Math.PI * 2);
                ctx.stroke();

                // Hub
                ctx.fillStyle = '#64748b';
                ctx.fillRect(wx - 1.5, wy - 1.5, 3, 3);

                // Spokes rotating based on frame
                const angleOffset = (frame / 8) * Math.PI;
                ctx.strokeStyle = '#94a3b8';
                ctx.lineWidth = 0.8;
                for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
                    const ang = a + angleOffset;
                    ctx.beginPath();
                    ctx.moveTo(wx, wy);
                    ctx.lineTo(wx + Math.cos(ang) * (wheelR - 1.5), wy + Math.sin(ang) * (wheelR - 1.5));
                    ctx.stroke();
                }
            };

            drawWheel(rearWheelX, wheelY);
            drawWheel(frontWheelX, wheelY);

            // Bicycle Frame (Sleek slate / teal vintage commuter)
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            // Chainstay: rear hub to bottom bracket (BB)
            const bbX = 30;
            const bbY = 35;
            ctx.moveTo(rearWheelX, wheelY);
            ctx.lineTo(bbX, bbY);
            // Seat tube: BB to saddle post
            const saddlePostX = 26;
            const saddlePostY = 22;
            ctx.lineTo(saddlePostX, saddlePostY);
            // Seat stay: saddle post to rear hub
            ctx.lineTo(rearWheelX, wheelY);
            // Down tube: BB to head tube
            const headX = 46;
            const headY = 18;
            ctx.moveTo(bbX, bbY);
            ctx.lineTo(headX, headY);
            // Top tube: saddle post to head tube
            ctx.moveTo(saddlePostX, saddlePostY);
            ctx.lineTo(headX, headY);
            // Fork: head tube to front wheel
            ctx.lineTo(frontWheelX, wheelY);
            ctx.stroke();

            // Handlebars & Stem
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(headX, headY);
            ctx.lineTo(headX - 1, headY - 5);
            ctx.lineTo(headX + 4, headY - 6);
            ctx.stroke();

            // Warm Headlight
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(headX + 5, headY - 5, 3, 3);
            // Light cone
            ctx.fillStyle = 'rgba(254, 240, 138, 0.15)';
            ctx.beginPath();
            ctx.moveTo(headX + 8, headY - 4);
            ctx.lineTo(W, headY - 8);
            ctx.lineTo(W, headY + 12);
            ctx.closePath();
            ctx.fill();

            // Saddle
            ctx.fillStyle = '#78350f'; // Leather brown
            ctx.beginPath();
            ctx.ellipse(saddlePostX - 1, saddlePostY - 1, 5, 2, -0.1, 0, Math.PI * 2);
            ctx.fill();

            // Crank & Pedals calculation
            const crankAngle = (frame / 8) * Math.PI * 2;
            const crankLen = 6;
            const pedal1X = bbX + Math.cos(crankAngle) * crankLen;
            const pedal1Y = bbY + Math.sin(crankAngle) * crankLen;
            const pedal2X = bbX - Math.cos(crankAngle) * crankLen;
            const pedal2Y = bbY - Math.sin(crankAngle) * crankLen;

            // Crank arm
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(pedal2X, pedal2Y);
            ctx.lineTo(pedal1X, pedal1Y);
            ctx.stroke();

            // --- RIDER (Pranesh) ---
            const hipX = saddlePostX;
            const hipY = saddlePostY - 3;

            // Torso (Comfortable forward lean)
            const shoulderX = 35;
            const shoulderY = 14;

            // Back leg (pedal 2)
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(hipX, hipY);
            // Knee
            const knee2X = (hipX + pedal2X) / 2 + 2;
            const knee2Y = Math.min(hipY, pedal2Y) - 1;
            ctx.lineTo(knee2X, knee2Y);
            ctx.lineTo(pedal2X, pedal2Y);
            ctx.stroke();

            // Torso / Cozy Jacket (Navy / Teal)
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.moveTo(hipX - 3, hipY);
            ctx.lineTo(shoulderX, shoulderY - 2);
            ctx.lineTo(shoulderX + 4, shoulderY + 2);
            ctx.lineTo(hipX + 3, hipY + 1);
            ctx.closePath();
            ctx.fill();

            // Scarf / Accent (warm amber)
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(shoulderX + 1, shoulderY - 4, 4, 3);

            // Front leg (pedal 1)
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.moveTo(hipX, hipY);
            const knee1X = (hipX + pedal1X) / 2 + 3;
            const knee1Y = Math.min(hipY, pedal1Y) - 2;
            ctx.lineTo(knee1X, knee1Y);
            ctx.lineTo(pedal1X, pedal1Y);
            ctx.stroke();

            // Shoes
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(pedal1X - 2, pedal1Y - 1, 5, 2);

            // Arms holding handlebars
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(shoulderX + 2, shoulderY);
            ctx.lineTo(headX + 2, headY - 5);
            ctx.stroke();

            // Head & Cap / Hair
            const headCenterX = shoulderX + 3;
            const headCenterY = shoulderY - 7;
            ctx.fillStyle = '#e29578'; // Skin
            ctx.beginPath();
            ctx.arc(headCenterX, headCenterY, 4, 0, Math.PI * 2);
            ctx.fill();

            // Dark textured hair & headphones
            ctx.fillStyle = '#090d16';
            ctx.fillRect(headCenterX - 3, headCenterY - 5, 7, 4);
            // Lo-fi headphones
            ctx.fillStyle = '#ec4899';
            ctx.fillRect(headCenterX - 1, headCenterY - 3, 3, 5);

            scene.textures.addCanvas(`cyclist_pedal_${frame}`, canvas);
        }
    }

    // ==========================================
    // 2. ENVIRONMENT & MILESTONE PAVILIONS
    // ==========================================
    static generateEnvironment(scene) {
        // Milestone Gazebo / Lantern Pavilion (80x120)
        {
            const { canvas, ctx } = this.createCanvas(80, 120);

            // Wooden deck
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(4, 108, 72, 12);
            ctx.fillStyle = '#334155';
            ctx.fillRect(8, 110, 64, 4);

            // Pillars
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(10, 30, 6, 80);
            ctx.fillRect(64, 30, 6, 80);

            // Pagoda Roof
            ctx.fillStyle = '#0284c7';
            ctx.beginPath();
            ctx.moveTo(0, 30);
            ctx.lineTo(40, 8);
            ctx.lineTo(80, 30);
            ctx.lineTo(76, 36);
            ctx.lineTo(4, 36);
            ctx.closePath();
            ctx.fill();

            // Glowing Paper Lantern
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(40, 52, 9, 0, Math.PI * 2);
            ctx.fill();
            // Lantern ribs
            ctx.strokeStyle = '#b45309';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Warm lantern glow aura
            const grad = ctx.createRadialGradient(40, 52, 2, 40, 52, 32);
            grad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
            grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(40, 52, 32, 0, Math.PI * 2);
            ctx.fill();

            // Signboard in pavilion
            ctx.fillStyle = '#090d16';
            ctx.fillRect(20, 75, 40, 24);
            ctx.strokeStyle = '#38bdf8';
            ctx.strokeRect(20, 75, 40, 24);

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 7px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('STATION', 40, 86);
            ctx.fillText('ACCESS', 40, 94);

            scene.textures.addCanvas('station_pavilion', canvas);
        }

        // Street Lamp (32x90) with warm light cone
        {
            const { canvas, ctx } = this.createCanvas(32, 90);
            // Pole
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(14, 18, 4, 72);
            // Base
            ctx.fillRect(11, 86, 10, 4);
            // Curved arm
            ctx.fillStyle = '#334155';
            ctx.fillRect(12, 12, 12, 4);
            // Lamp casing
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(18, 14, 10, 6);
            // Glowing bulb
            ctx.fillStyle = '#fde047';
            ctx.fillRect(20, 20, 6, 4);

            scene.textures.addCanvas('street_lamp', canvas);
        }

        // Scenic Flowering Cherry / Lo-fi Tree (64x90)
        {
            const { canvas, ctx } = this.createCanvas(64, 90);
            // Trunk
            ctx.fillStyle = '#1c1917';
            ctx.beginPath();
            ctx.moveTo(28, 90);
            ctx.lineTo(34, 90);
            ctx.lineTo(36, 50);
            ctx.lineTo(44, 40);
            ctx.lineTo(32, 44);
            ctx.lineTo(24, 38);
            ctx.lineTo(28, 50);
            ctx.closePath();
            ctx.fill();

            // Lush Foliage Clouds (Soft Lavender & Pink)
            const drawPuff = (cx, cy, r, color) => {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fill();
            };

            drawPuff(32, 32, 22, '#4a044e');
            drawPuff(22, 26, 16, '#701a75');
            drawPuff(42, 26, 17, '#86198f');
            drawPuff(32, 18, 18, '#a21caf');
            drawPuff(26, 14, 12, '#c026d3');
            drawPuff(38, 14, 13, '#e879f9');
            drawPuff(32, 10, 10, '#f5d0fe');

            scene.textures.addCanvas('lofi_tree', canvas);
        }

        // Road Platform Tile (64x40)
        {
            const { canvas, ctx } = this.createCanvas(64, 40);
            // Dark smooth asphalt road
            ctx.fillStyle = '#0c101d';
            ctx.fillRect(0, 0, 64, 40);
            // Road top curb with soft grass
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(0, 0, 64, 4);
            ctx.fillStyle = '#065f46'; // Emerald grass rim
            ctx.fillRect(0, 0, 64, 2);

            // Dashed painted road center line
            ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
            ctx.fillRect(16, 20, 32, 3);

            scene.textures.addCanvas('road_tile', canvas);
        }

        // Drifting Petal Particle (8x8)
        {
            const { canvas, ctx } = this.createCanvas(8, 8);
            ctx.fillStyle = '#f472b6';
            ctx.beginPath();
            ctx.ellipse(4, 4, 3.5, 2, 0.4, 0, Math.PI * 2);
            ctx.fill();
            scene.textures.addCanvas('particle_petal', canvas);
        }
    }

    // ==========================================
    // 3. PARALLAX BACKGROUNDS
    // ==========================================
    static generateBackgrounds(scene) {
        // Sky Layer: Lo-Fi Twilight Gradient with Crescent Moon (600x384)
        {
            const { canvas, ctx } = this.createCanvas(600, 384);
            const grad = ctx.createLinearGradient(0, 0, 0, 384);
            grad.addColorStop(0, '#09081e');   // Deep indigo night
            grad.addColorStop(0.4, '#1e143b'); // Warm twilight violet
            grad.addColorStop(0.7, '#44184c'); // Magenta dusk
            grad.addColorStop(0.9, '#7a2846'); // Sunset peach
            grad.addColorStop(1, '#1e1026');   // Horizon base
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 600, 384);

            // Crescent Moon
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(460, 90, 24, 0, Math.PI * 2);
            ctx.fill();
            // Shadow circle cutting out crescent
            ctx.fillStyle = '#110d29';
            ctx.beginPath();
            ctx.arc(468, 86, 22, 0, Math.PI * 2);
            ctx.fill();

            // Moon halo
            const moonGrad = ctx.createRadialGradient(460, 90, 10, 460, 90, 70);
            moonGrad.addColorStop(0, 'rgba(254, 240, 138, 0.15)');
            moonGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
            ctx.fillStyle = moonGrad;
            ctx.beginPath();
            ctx.arc(460, 90, 70, 0, Math.PI * 2);
            ctx.fill();

            // Stars / Constellations
            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < 45; i++) {
                const sx = (i * 83) % 600;
                const sy = (i * 47) % 200;
                const r = (i % 3 === 0) ? 1.5 : 1;
                ctx.fillRect(sx, sy, r, r);
            }

            scene.textures.addCanvas('bg_lofi_sky', canvas);
        }

        // Hills Layer: Distant Mountains & Pine Forest Silhouettes (600x240)
        {
            const { canvas, ctx } = this.createCanvas(600, 240);
            ctx.clearRect(0, 0, 600, 240);

            // Distant rolling mountain silhouette
            ctx.fillStyle = '#170f2a';
            ctx.beginPath();
            ctx.moveTo(0, 240);
            ctx.lineTo(0, 120);
            ctx.bezierCurveTo(120, 70, 220, 140, 320, 90);
            ctx.bezierCurveTo(420, 40, 520, 110, 600, 70);
            ctx.lineTo(600, 240);
            ctx.closePath();
            ctx.fill();

            // Midground hills with pine tree silhouettes
            ctx.fillStyle = '#0d091a';
            ctx.beginPath();
            ctx.moveTo(0, 240);
            ctx.lineTo(0, 150);
            ctx.bezierCurveTo(140, 120, 280, 180, 420, 130);
            ctx.bezierCurveTo(500, 110, 560, 140, 600, 130);
            ctx.lineTo(600, 240);
            ctx.closePath();
            ctx.fill();

            // Stylized little pine trees along ridge
            ctx.fillStyle = '#090614';
            for (let px = 10; px < 590; px += 28) {
                const py = 145 + Math.sin(px * 0.02) * 15;
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(px + 4, py - 14);
                ctx.lineTo(px + 8, py);
                ctx.closePath();
                ctx.fill();
            }

            scene.textures.addCanvas('bg_lofi_hills', canvas);
        }
    }

    // ==========================================
    // 4. ANIMATIONS
    // ==========================================
    static registerAnimations(scene) {
        scene.anims.create({
            key: 'anim_cyclist_pedal',
            frames: [
                { key: 'cyclist_pedal_0' },
                { key: 'cyclist_pedal_1' },
                { key: 'cyclist_pedal_2' },
                { key: 'cyclist_pedal_3' },
                { key: 'cyclist_pedal_4' },
                { key: 'cyclist_pedal_5' },
                { key: 'cyclist_pedal_6' },
                { key: 'cyclist_pedal_7' }
            ],
            frameRate: 10,
            repeat: -1
        });
    }
}

window.SpriteGenerator = SpriteGenerator;

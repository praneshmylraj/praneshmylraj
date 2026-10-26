/**
 * Evening Sunset & Warm Golden-Hour Artwork Generator
 * High-detail procedural scenery, animated cyclist with flowing scarf,
 * glowing vintage streetlamps, cozy roadside pavilions, and fireflies.
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
        ctx.imageSmoothingEnabled = true;
        return { canvas, ctx };
    }

    // ==========================================
    // 1. DETAILED CYCLIST (Pranesh in sunset breeze)
    // ==========================================
    static generateCyclist(scene) {
        const W = 80;
        const H = 64;

        // 8-frame smooth pedaling cycle
        for (let frame = 0; frame < 8; frame++) {
            const { canvas, ctx } = this.createCanvas(W, H);

            // Soft Ground Shadow with sunset angle
            ctx.fillStyle = 'rgba(20, 10, 25, 0.35)';
            ctx.beginPath();
            ctx.ellipse(40, 58, 32, 5, 0.05, 0, Math.PI * 2);
            ctx.fill();

            // Wheel Geometry
            const rearX = 18;
            const frontX = 62;
            const wheelY = 46;
            const wheelR = 12;

            // Function to render detailed bicycle wheel
            const renderWheel = (wx, wy) => {
                // Outer rubber tire
                ctx.strokeStyle = '#18181b';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(wx, wy, wheelR, 0, Math.PI * 2);
                ctx.stroke();

                // Polished silver rim
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.arc(wx, wy, wheelR - 1.5, 0, Math.PI * 2);
                ctx.stroke();

                // Hub
                ctx.fillStyle = '#94a3b8';
                ctx.beginPath();
                ctx.arc(wx, wy, 2.5, 0, Math.PI * 2);
                ctx.fill();

                // 8 Rotating spokes
                const angleOffset = (frame / 8) * Math.PI;
                ctx.strokeStyle = 'rgba(203, 213, 225, 0.85)';
                ctx.lineWidth = 0.9;
                for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
                    const ang = a + angleOffset;
                    ctx.beginPath();
                    ctx.moveTo(wx, wy);
                    ctx.lineTo(wx + Math.cos(ang) * (wheelR - 2), wy + Math.sin(ang) * (wheelR - 2));
                    ctx.stroke();
                }
            };

            renderWheel(rearX, wheelY);
            renderWheel(frontX, wheelY);

            // Bicycle Frame (Vintage Commuter in Warm Slate-Teal with Metallic Sheen)
            const bbX = 38;
            const bbY = 46;
            const saddlePostX = 32;
            const saddlePostY = 30;
            const headX = 56;
            const headY = 24;

            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Rear triangle
            ctx.beginPath();
            ctx.moveTo(rearX, wheelY);
            ctx.lineTo(bbX, bbY);
            ctx.lineTo(saddlePostX, saddlePostY);
            ctx.lineTo(rearX, wheelY);
            // Main triangle
            ctx.moveTo(bbX, bbY);
            ctx.lineTo(headX, headY);
            ctx.lineTo(saddlePostX, saddlePostY);
            // Fork
            ctx.moveTo(headX, headY);
            ctx.lineTo(frontX, wheelY);
            ctx.stroke();

            // Rear luggage rack
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(rearX, wheelY);
            ctx.lineTo(saddlePostX - 8, saddlePostY + 3);
            ctx.lineTo(saddlePostX - 2, saddlePostY + 3);
            ctx.stroke();

            // Red Rear Safety Reflector Light
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(saddlePostX - 9, saddlePostY + 1, 3, 3);

            // Handlebars & Stem
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(headX, headY);
            ctx.lineTo(headX - 1, headY - 7);
            ctx.lineTo(headX + 5, headY - 8);
            ctx.stroke();

            // Front Vintage Headlight (Warm Amber Glow)
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(headX + 6, headY - 8, 4, 4);

            // Warm Volumetric Light Cone
            const lightGrad = ctx.createLinearGradient(headX + 10, headY - 6, W, headY + 10);
            lightGrad.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
            lightGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.18)');
            lightGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
            ctx.fillStyle = lightGrad;
            ctx.beginPath();
            ctx.moveTo(headX + 10, headY - 7);
            ctx.lineTo(W, headY - 14);
            ctx.lineTo(W, headY + 18);
            ctx.closePath();
            ctx.fill();

            // Vintage Leather Saddle
            ctx.fillStyle = '#78350f';
            ctx.beginPath();
            ctx.ellipse(saddlePostX - 1, saddlePostY - 2, 7, 3, -0.08, 0, Math.PI * 2);
            ctx.fill();

            // Pedals & Cranks (Rotational calculation)
            const crankAng = (frame / 8) * Math.PI * 2;
            const crankRadius = 7;
            const p1X = bbX + Math.cos(crankAng) * crankRadius;
            const p1Y = bbY + Math.sin(crankAng) * crankRadius;
            const p2X = bbX - Math.cos(crankAng) * crankRadius;
            const p2Y = bbY - Math.sin(crankAng) * crankRadius;

            // Crank arm
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(p2X, p2Y);
            ctx.lineTo(p1X, p1Y);
            ctx.stroke();

            // --- CYCLIST (Pranesh) ---
            const hipX = saddlePostX;
            const hipY = saddlePostY - 4;
            const shoulderX = 44;
            const shoulderY = 18;

            // Back leg (Pedal 2)
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.moveTo(hipX, hipY);
            const k2X = (hipX + p2X) / 2 + 1;
            const k2Y = Math.min(hipY, p2Y) - 2;
            ctx.lineTo(k2X, k2Y);
            ctx.lineTo(p2X, p2Y);
            ctx.stroke();

            // Cozy Autumn Sweater / Jacket (Warm Terracotta / Navy)
            ctx.fillStyle = '#c2410c'; // Warm sunset rust sweater
            ctx.beginPath();
            ctx.moveTo(hipX - 3, hipY + 1);
            ctx.lineTo(shoulderX - 2, shoulderY - 3);
            ctx.lineTo(shoulderX + 5, shoulderY + 3);
            ctx.lineTo(hipX + 3, hipY + 2);
            ctx.closePath();
            ctx.fill();

            // Flowing Sunset Scarf (animated fluttering in breeze)
            const scarfFlutter = Math.sin((frame / 8) * Math.PI * 2) * 3;
            ctx.fillStyle = '#facc15'; // Warm golden yellow scarf
            ctx.beginPath();
            ctx.moveTo(shoulderX - 1, shoulderY - 5);
            ctx.lineTo(shoulderX - 14, shoulderY - 7 + scarfFlutter);
            ctx.lineTo(shoulderX - 18, shoulderY - 2 + scarfFlutter);
            ctx.lineTo(shoulderX + 2, shoulderY - 1);
            ctx.closePath();
            ctx.fill();

            // Front leg (Pedal 1)
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(hipX, hipY);
            const k1X = (hipX + p1X) / 2 + 2;
            const k1Y = Math.min(hipY, p1Y) - 3;
            ctx.lineTo(k1X, k1Y);
            ctx.lineTo(p1X, p1Y);
            ctx.stroke();

            // Clean white sneaker
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(p1X - 2, p1Y - 1, 6, 3);

            // Arms holding handlebars
            ctx.strokeStyle = '#c2410c';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(shoulderX + 2, shoulderY);
            ctx.lineTo(headX + 4, headY - 6);
            ctx.stroke();

            // Head & Commuter Cap
            const headXPos = shoulderX + 3;
            const headYPos = shoulderY - 8;

            ctx.fillStyle = '#e29578'; // Face
            ctx.beginPath();
            ctx.arc(headXPos, headYPos, 5, 0, Math.PI * 2);
            ctx.fill();

            // Dark hair
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(headXPos - 4, headYPos - 6, 8, 4);

            // Cozy Lo-Fi Over-Ear Headphones
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(headXPos - 1, headYPos - 1, 3, 0, Math.PI * 2);
            ctx.fill();

            scene.textures.addCanvas(`cyclist_pedal_${frame}`, canvas);
        }
    }

    // ==========================================
    // 2. ENVIRONMENT & WARM MILESTONE PAVILIONS
    // ==========================================
    static generateEnvironment(scene) {
        // Milestone Pavilion (Cozy Tea-House & Coffee Lookout) - 100x130
        {
            const { canvas, ctx } = this.createCanvas(100, 130);

            // Wooden Raised Deck Platform
            ctx.fillStyle = '#292524';
            ctx.fillRect(4, 114, 92, 16);
            ctx.fillStyle = '#44403c';
            ctx.fillRect(8, 116, 84, 4);

            // Timber Pillars
            ctx.fillStyle = '#1c1917';
            ctx.fillRect(12, 34, 7, 82);
            ctx.fillRect(81, 34, 7, 82);

            // Japanese/Scandinavian Pagoda Roof in Warm Terracotta
            ctx.fillStyle = '#9a3412';
            ctx.beginPath();
            ctx.moveTo(0, 34);
            ctx.lineTo(50, 8);
            ctx.lineTo(100, 34);
            ctx.lineTo(94, 40);
            ctx.lineTo(6, 40);
            ctx.closePath();
            ctx.fill();

            // Roof Ridge highlight
            ctx.strokeStyle = '#ea580c';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, 34);
            ctx.lineTo(50, 8);
            ctx.lineTo(100, 34);
            ctx.stroke();

            // Cozy Wooden Bench inside
            ctx.fillStyle = '#78350f';
            ctx.fillRect(28, 98, 44, 6);
            ctx.fillRect(32, 104, 4, 12);
            ctx.fillRect(64, 104, 4, 12);

            // Steaming Tea / Coffee Mug on bench
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(48, 92, 5, 6);
            // Steam
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.moveTo(50, 90);
            ctx.bezierCurveTo(48, 85, 52, 82, 50, 78);
            ctx.stroke();

            // Glowing Paper Lantern with Warm Sunset Light
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.arc(50, 56, 11, 0, Math.PI * 2);
            ctx.fill();

            // Lantern ribs
            ctx.strokeStyle = '#b45309';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(50, 56, 11, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(50, 45);
            ctx.lineTo(50, 67);
            ctx.stroke();

            // Volumetric Lantern Amber Glow
            const glow = ctx.createRadialGradient(50, 56, 4, 50, 56, 42);
            glow.addColorStop(0, 'rgba(253, 224, 71, 0.55)');
            glow.addColorStop(0.5, 'rgba(245, 158, 11, 0.25)');
            glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(50, 56, 42, 0, Math.PI * 2);
            ctx.fill();

            // Station Signboard Plaque
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(22, 72, 56, 22);
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1.2;
            ctx.strokeRect(22, 72, 56, 22);

            ctx.fillStyle = '#fef08a';
            ctx.font = 'bold 8px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('STATION', 50, 82);
            ctx.fillText('STORY', 50, 91);

            scene.textures.addCanvas('station_pavilion', canvas);
        }

        // Vintage Street Lamp with Warm Amber Volumetric Light Cone (48x100)
        {
            const { canvas, ctx } = this.createCanvas(48, 100);
            // Black Cast Iron Pole
            ctx.fillStyle = '#1c1917';
            ctx.fillRect(22, 16, 4, 84);
            // Base
            ctx.fillRect(18, 94, 12, 6);
            // Ornate Lamp Housing
            ctx.fillStyle = '#292524';
            ctx.fillRect(16, 12, 16, 6);
            ctx.fillRect(18, 18, 12, 10);

            // Glowing Amber Filament
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(22, 20, 4, 6);

            // Volumetric Amber Light Cone down to road
            const cone = ctx.createLinearGradient(24, 26, 24, 100);
            cone.addColorStop(0, 'rgba(253, 224, 71, 0.45)');
            cone.addColorStop(0.6, 'rgba(245, 158, 11, 0.2)');
            cone.addColorStop(1, 'rgba(245, 158, 11, 0)');
            ctx.fillStyle = cone;
            ctx.beginPath();
            ctx.moveTo(20, 26);
            ctx.lineTo(28, 26);
            ctx.lineTo(44, 100);
            ctx.lineTo(4, 100);
            ctx.closePath();
            ctx.fill();

            scene.textures.addCanvas('street_lamp', canvas);
        }

        // Blooming Sunset Tree (72x100)
        {
            const { canvas, ctx } = this.createCanvas(72, 100);
            // Trunk
            ctx.fillStyle = '#1c1917';
            ctx.beginPath();
            ctx.moveTo(32, 100);
            ctx.lineTo(40, 100);
            ctx.lineTo(42, 55);
            ctx.lineTo(52, 42);
            ctx.lineTo(38, 48);
            ctx.lineTo(26, 40);
            ctx.lineTo(32, 55);
            ctx.closePath();
            ctx.fill();

            // Foliage in warm sunset blossoms (Rose, Peach, Gold)
            const drawPuff = (cx, cy, r, fill) => {
                ctx.fillStyle = fill;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fill();
            };

            drawPuff(36, 36, 26, '#701a75'); // Dark violet base
            drawPuff(26, 30, 20, '#9d174d'); // Rose
            drawPuff(46, 30, 22, '#be185d');
            drawPuff(36, 22, 20, '#e11d48'); // Warm cherry
            drawPuff(28, 16, 15, '#fb7185'); // Peach
            drawPuff(44, 16, 16, '#f43f5e');
            drawPuff(36, 12, 12, '#fecdd3'); // Golden pink highlight

            scene.textures.addCanvas('lofi_tree', canvas);
        }

        // Telegraph Pole with Power Lines (64x120)
        {
            const { canvas, ctx } = this.createCanvas(64, 120);
            // Wooden pole
            ctx.fillStyle = '#292524';
            ctx.fillRect(30, 10, 4, 110);
            // Crossbeam
            ctx.fillRect(12, 20, 40, 4);
            // Insulator cups
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(14, 17, 3, 3);
            ctx.fillRect(28, 17, 3, 3);
            ctx.fillRect(47, 17, 3, 3);

            // Silhouetted little bird sitting on wire!
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.ellipse(38, 18, 2.5, 1.8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(39.5, 17, 1.5, 1); // beak

            scene.textures.addCanvas('telegraph_pole', canvas);
        }

        // Smooth Asphalt Road Platform (64x40)
        {
            const { canvas, ctx } = this.createCanvas(64, 40);
            // Dark warm asphalt
            ctx.fillStyle = '#181424';
            ctx.fillRect(0, 0, 64, 40);

            // Top curb reflecting sunset warmth
            ctx.fillStyle = '#475569';
            ctx.fillRect(0, 0, 64, 4);
            ctx.fillStyle = '#f59e0b'; // Warm golden reflection line
            ctx.fillRect(0, 0, 64, 1.5);

            // Warm road divider dashes
            ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
            ctx.fillRect(16, 20, 32, 3);

            scene.textures.addCanvas('road_tile', canvas);
        }

        // Firefly Particle (8x8)
        {
            const { canvas, ctx } = this.createCanvas(8, 8);
            const grad = ctx.createRadialGradient(4, 4, 1, 4, 4, 4);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.4, '#fde047');
            grad.addColorStop(1, 'rgba(253, 224, 71, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(4, 4, 4, 0, Math.PI * 2);
            ctx.fill();
            scene.textures.addCanvas('particle_firefly', canvas);
        }

        // Falling Blossom Petal (8x8)
        {
            const { canvas, ctx } = this.createCanvas(8, 8);
            ctx.fillStyle = '#f472b6';
            ctx.beginPath();
            ctx.ellipse(4, 4, 3.5, 2, 0.3, 0, Math.PI * 2);
            ctx.fill();
            scene.textures.addCanvas('particle_petal', canvas);
        }
    }

    // ==========================================
    // 3. PARALLAX BACKGROUNDS (Warm Sunset)
    // ==========================================
    static generateBackgrounds(scene) {
        // Layer 1: Sunset Sky with Golden Sun & Backlit Evening Clouds (720x384)
        {
            const { canvas, ctx } = this.createCanvas(720, 384);

            // Rich Sunset Sky Gradient
            const skyGrad = ctx.createLinearGradient(0, 0, 0, 384);
            skyGrad.addColorStop(0, '#130d24');   // Deep twilight indigo
            skyGrad.addColorStop(0.3, '#2a1138'); // Twilight violet
            skyGrad.addColorStop(0.55, '#681e46'); // Magenta dusk
            skyGrad.addColorStop(0.75, '#b43a32'); // Warm terracotta
            skyGrad.addColorStop(0.9, '#e06d2c');  // Golden amber
            skyGrad.addColorStop(1, '#facc15');   // Setting sun horizon glow
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, 720, 384);

            // Setting Golden Sun Orb on the Horizon
            const sunX = 360;
            const sunY = 260;

            // Sun Outer Warm Halo
            const haloGrad = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 160);
            haloGrad.addColorStop(0, 'rgba(254, 240, 138, 0.7)');
            haloGrad.addColorStop(0.35, 'rgba(251, 146, 60, 0.4)');
            haloGrad.addColorStop(0.7, 'rgba(236, 72, 153, 0.15)');
            haloGrad.addColorStop(1, 'rgba(236, 72, 153, 0)');
            ctx.fillStyle = haloGrad;
            ctx.beginPath();
            ctx.arc(sunX, sunY, 160, 0, Math.PI * 2);
            ctx.fill();

            // Radiant Sun Core
            const sunCore = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 48);
            sunCore.addColorStop(0, '#ffffff');
            sunCore.addColorStop(0.5, '#fef08a');
            sunCore.addColorStop(1, '#f97316');
            ctx.fillStyle = sunCore;
            ctx.beginPath();
            ctx.arc(sunX, sunY, 48, 0, Math.PI * 2);
            ctx.fill();

            // Fluffy Evening Clouds backlit by the setting sun
            const drawCloud = (cx, cy, w, color, rimColor) => {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.ellipse(cx, cy, w, w * 0.35, 0, 0, Math.PI * 2);
                ctx.ellipse(cx - w * 0.35, cy - 2, w * 0.5, w * 0.28, 0, 0, Math.PI * 2);
                ctx.ellipse(cx + w * 0.35, cy - 4, w * 0.6, w * 0.32, 0, 0, Math.PI * 2);
                ctx.fill();

                // Golden top rim
                ctx.fillStyle = rimColor;
                ctx.beginPath();
                ctx.ellipse(cx, cy - w * 0.25, w * 0.8, w * 0.12, 0, 0, Math.PI * 2);
                ctx.fill();
            };

            drawCloud(160, 180, 90, 'rgba(60, 20, 55, 0.6)', 'rgba(251, 191, 36, 0.45)');
            drawCloud(560, 195, 110, 'rgba(75, 25, 60, 0.65)', 'rgba(251, 191, 36, 0.45)');
            drawCloud(340, 120, 140, 'rgba(45, 15, 45, 0.5)', 'rgba(254, 215, 170, 0.35)');

            // Distant soft mountain ridges
            ctx.fillStyle = '#220d2d';
            ctx.beginPath();
            ctx.moveTo(0, 384);
            ctx.lineTo(0, 275);
            ctx.bezierCurveTo(120, 240, 240, 290, 360, 255);
            ctx.bezierCurveTo(480, 220, 600, 280, 720, 250);
            ctx.lineTo(720, 384);
            ctx.closePath();
            ctx.fill();

            scene.textures.addCanvas('bg_sunset_sky', canvas);
        }

        // Layer 2: Midground Rolling Hills & Cozy Village Rooftops with Lit Windows (720x260)
        {
            const { canvas, ctx } = this.createCanvas(720, 260);
            ctx.clearRect(0, 0, 720, 260);

            // Dark violet hills
            ctx.fillStyle = '#150a22';
            ctx.beginPath();
            ctx.moveTo(0, 260);
            ctx.lineTo(0, 140);
            ctx.bezierCurveTo(160, 110, 320, 160, 480, 125);
            ctx.bezierCurveTo(580, 105, 660, 140, 720, 130);
            ctx.lineTo(720, 260);
            ctx.closePath();
            ctx.fill();

            // Cozy Village Cottage Silhouettes along the hilltops
            const cottages = [
                { x: 70, y: 125, w: 32, h: 22 },
                { x: 190, y: 140, w: 28, h: 18 },
                { x: 310, y: 145, w: 35, h: 24 },
                { x: 450, y: 120, w: 30, h: 20 },
                { x: 590, y: 122, w: 34, h: 22 },
            ];

            cottages.forEach(c => {
                // House body
                ctx.fillStyle = '#0a0512';
                ctx.fillRect(c.x, c.y, c.w, c.h);

                // Gable roof
                ctx.fillStyle = '#1c0d28';
                ctx.beginPath();
                ctx.moveTo(c.x - 3, c.y);
                ctx.lineTo(c.x + c.w / 2, c.y - 10);
                ctx.lineTo(c.x + c.w + 3, c.y);
                ctx.closePath();
                ctx.fill();

                // Warm Glowing Window!
                ctx.fillStyle = '#fef08a';
                ctx.fillRect(c.x + 8, c.y + 6, 7, 7);

                // Window warm glow
                ctx.fillStyle = 'rgba(254, 240, 138, 0.3)';
                ctx.fillRect(c.x + 6, c.y + 4, 11, 11);
            });

            // Pine tree silhouettes
            ctx.fillStyle = '#0a0512';
            for (let px = 15; px < 710; px += 35) {
                const py = 135 + Math.sin(px * 0.02) * 12;
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(px + 5, py - 16);
                ctx.lineTo(px + 10, py);
                ctx.closePath();
                ctx.fill();
            }

            scene.textures.addCanvas('bg_village_hills', canvas);
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

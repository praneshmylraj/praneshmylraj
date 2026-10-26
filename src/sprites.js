/**
 * Procedural Pixel Art and Texture Generator for Pranesh's World Runner
 * Generates crisp 8-bit/16-bit cyber aesthetics without needing any image downloads!
 */

class SpriteGenerator {
    static generateAll(scene) {
        this.generatePlayerFrames(scene);
        this.generateEnvironmentTiles(scene);
        this.generateCollectibles(scene);
        this.generateEnemies(scene);
        this.generateInteractiveObjects(scene);
        this.generateParticles(scene);
        this.generateBackgrounds(scene);
        this.registerAnimations(scene);
    }

    // Helper to create a canvas texture
    static createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        return { canvas, ctx };
    }

    // ==========================================
    // 1. PLAYER SPRITES (Pranesh the Cyber Runner)
    // ==========================================
    static generatePlayerFrames(scene) {
        const W = 32;
        const H = 40;

        // Draw Pranesh base character
        const drawPranesh = (ctx, animState = 'idle', frame = 0) => {
            ctx.clearRect(0, 0, W, H);

            // Coordinates
            let headY = 8;
            let torsoY = 17;
            let legL_Y = 28;
            let legR_Y = 28;
            let legL_X = 10;
            let legR_X = 18;
            let armL_X = 6;
            let armR_X = 22;
            let armL_Y = 18;
            let armR_Y = 18;
            let bodyAngle = 0;

            if (animState === 'idle') {
                const bounce = (frame % 2 === 0) ? 0 : 1;
                headY += bounce;
                torsoY += bounce;
            } else if (animState === 'run') {
                // 6-frame run cycle
                const offsets = [
                    { lY: -2, rY: 2, lX: -3, rX: 3, bob: 0, armL: 4, armR: -4 },
                    { lY: 0,  rY: 0, lX: -1, rX: 1, bob: -1, armL: 2, armR: -2 },
                    { lY: 2,  rY: -2, lX: 1, rX: -1, bob: -2, armL: -1, armR: 1 },
                    { lY: 2,  rY: -2, lX: 3, rX: -3, bob: 0, armL: -4, armR: 4 },
                    { lY: 0,  rY: 0, lX: 1, rX: -1, bob: -1, armL: -2, armR: 2 },
                    { lY: -2, rY: 2, lX: -1, rX: 1, bob: -2, armL: 1, armR: -1 }
                ][frame % 6];

                headY += offsets.bob;
                torsoY += offsets.bob;
                legL_Y += offsets.lY;
                legR_Y += offsets.rY;
                legL_X += offsets.lX;
                legR_X += offsets.rX;
                armL_Y += offsets.armL;
                armR_Y += offsets.armR;
            } else if (animState === 'jump') {
                headY -= 2;
                torsoY -= 2;
                legL_Y -= 3;
                legR_Y -= 1;
                armL_Y -= 4;
                armR_Y -= 4;
            } else if (animState === 'fall') {
                legL_Y += 1;
                legR_Y += 2;
                armL_Y -= 3;
                armR_Y -= 3;
            } else if (animState === 'dash') {
                // Leaning forward heavily with speed trail
                headY += 2;
                torsoY += 3;
                legL_X -= 4;
                legR_X -= 7;
                legL_Y -= 2;
                legR_Y += 1;
                armL_X -= 4;
                armR_X += 3;
                bodyAngle = 0.2;
            } else if (animState === 'slide') {
                headY += 8;
                torsoY += 9;
                legL_X += 4;
                legR_X -= 4;
                legL_Y += 6;
                legR_Y += 6;
            }

            // --- Shadow on ground ---
            if (animState !== 'jump' && animState !== 'fall') {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.beginPath();
                ctx.ellipse(16, 38, 10, 3, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            // --- Legs & Tech Cargo Pants ---
            ctx.fillStyle = '#1e293b'; // Slate dark pants
            // Left leg
            ctx.fillRect(legL_X, legL_Y, 5, 8);
            // Right leg
            ctx.fillRect(legR_X, legR_Y, 5, 8);

            // Knee pads (neon cyan accents)
            ctx.fillStyle = '#06b6d4';
            ctx.fillRect(legL_X, legL_Y + 3, 5, 2);
            ctx.fillRect(legR_X, legR_Y + 3, 5, 2);

            // Sneakers / Thruster Boots
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(legL_X - 1, legL_Y + 7, 7, 3);
            ctx.fillRect(legR_X - 1, legR_Y + 7, 7, 3);
            // Thruster soles
            ctx.fillStyle = (animState === 'dash' || animState === 'jump') ? '#00f0ff' : '#ec4899';
            ctx.fillRect(legL_X - 1, legL_Y + 9, 7, 2);
            ctx.fillRect(legR_X - 1, legR_Y + 9, 7, 2);

            // --- Torso / Cyber Hoodie ---
            ctx.fillStyle = '#0f172a'; // Deep hoodie
            ctx.fillRect(10, torsoY, 13, 12);
            // Neon cyan inner trim & zipper
            ctx.fillStyle = '#00f0ff';
            ctx.fillRect(16, torsoY + 2, 2, 10);
            // Jacket highlights (magenta / cyan stripes)
            ctx.fillStyle = '#8b5cf6';
            ctx.fillRect(10, torsoY + 1, 2, 11);
            ctx.fillRect(21, torsoY + 1, 2, 11);

            // Glowing cyber badge 'P' on chest
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(12, torsoY + 4, 3, 4);

            // --- Arms ---
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(armL_X, armL_Y, 4, 9);
            ctx.fillRect(armR_X, armR_Y, 4, 9);
            // Gloves (cyan tips)
            ctx.fillStyle = '#00f0ff';
            ctx.fillRect(armL_X, armL_Y + 7, 4, 2);
            ctx.fillRect(armR_X, armR_Y + 7, 4, 2);

            // --- Head & Hair ---
            // Neck
            ctx.fillStyle = '#e29578';
            ctx.fillRect(14, headY + 7, 5, 3);
            // Face
            ctx.fillStyle = '#f8b29b';
            ctx.fillRect(12, headY, 9, 8);

            // Hair (Stylish dark textured hair with cyan streak)
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(11, headY - 4, 11, 5); // top
            ctx.fillRect(10, headY - 2, 3, 6);  // back
            ctx.fillRect(21, headY - 2, 2, 4);  // side
            // Cyan cyber streak in hair!
            ctx.fillStyle = '#00f0ff';
            ctx.fillRect(14, headY - 5, 4, 2);
            ctx.fillRect(17, headY - 3, 2, 2);

            // Cyber Visor / Smart Goggles (Glowing cyan & amber)
            ctx.fillStyle = '#00f0ff';
            ctx.fillRect(15, headY + 2, 7, 3);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(17, headY + 2, 2, 1); // reflection glint

            // Headset / Comm unit
            ctx.fillStyle = '#ec4899';
            ctx.fillRect(10, headY + 2, 2, 4);
        };

        // 1. Idle (4 frames)
        for (let i = 0; i < 4; i++) {
            const { canvas, ctx } = this.createCanvas(W, H);
            drawPranesh(ctx, 'idle', i);
            scene.textures.addCanvas(`player_idle_${i}`, canvas);
        }

        // 2. Run (6 frames)
        for (let i = 0; i < 6; i++) {
            const { canvas, ctx } = this.createCanvas(W, H);
            drawPranesh(ctx, 'run', i);
            scene.textures.addCanvas(`player_run_${i}`, canvas);
        }

        // 3. Jump (1 frame)
        {
            const { canvas, ctx } = this.createCanvas(W, H);
            drawPranesh(ctx, 'jump', 0);
            scene.textures.addCanvas('player_jump', canvas);
        }

        // 4. Fall (1 frame)
        {
            const { canvas, ctx } = this.createCanvas(W, H);
            drawPranesh(ctx, 'fall', 0);
            scene.textures.addCanvas('player_fall', canvas);
        }

        // 5. Dash (1 frame with speed lines & chromatic aberration)
        {
            const { canvas, ctx } = this.createCanvas(W, H);
            // Speed trail lines
            ctx.fillStyle = 'rgba(0, 240, 255, 0.35)';
            ctx.fillRect(0, 16, 12, 2);
            ctx.fillRect(2, 24, 10, 2);
            ctx.fillRect(1, 32, 14, 2);
            drawPranesh(ctx, 'dash', 0);
            scene.textures.addCanvas('player_dash', canvas);
        }

        // 6. Slide (1 frame)
        {
            const { canvas, ctx } = this.createCanvas(W, H);
            drawPranesh(ctx, 'slide', 0);
            // Sparks underneath
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(6, 36, 3, 2);
            ctx.fillRect(2, 37, 2, 1);
            scene.textures.addCanvas('player_slide', canvas);
        }
    }

    // ==========================================
    // 2. ENVIRONMENT TILES & PLATFORMS
    // ==========================================
    static generateEnvironmentTiles(scene) {
        // Tile 1: Kernel & OS Platform (Deep Navy Silicon with Cyan Circuit Traces)
        {
            const { canvas, ctx } = this.createCanvas(32, 32);
            // Base dark silicon plate
            ctx.fillStyle = '#0a0f1d';
            ctx.fillRect(0, 0, 32, 32);
            // Top metal rim
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(0, 0, 32, 4);
            ctx.fillStyle = '#00f0ff';
            ctx.fillRect(0, 0, 32, 1); // Neon top edge

            // Circuit board traces
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(4, 32);
            ctx.lineTo(4, 16);
            ctx.lineTo(14, 6);
            ctx.lineTo(26, 6);
            ctx.lineTo(26, 20);
            ctx.stroke();

            // Solder pads / microchip pins
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(3, 15, 3, 3);
            ctx.fillRect(25, 19, 3, 3);
            ctx.fillRect(16, 24, 4, 4);

            // Hex screws in corners
            ctx.fillStyle = '#64748b';
            ctx.fillRect(2, 6, 2, 2);
            ctx.fillRect(28, 6, 2, 2);

            scene.textures.addCanvas('tile_kernel', canvas);
        }

        // Tile 2: Blockchain Consensus Block (Violet / Gold Cryptographic Block)
        {
            const { canvas, ctx } = this.createCanvas(32, 32);
            // Base obsidian block
            ctx.fillStyle = '#170b28';
            ctx.fillRect(0, 0, 32, 32);
            // Golden consensus rim
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(0, 0, 32, 3);
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(0, 0, 32, 1);

            // Cryptographic chain link engraving
            ctx.strokeStyle = '#a855f7';
            ctx.lineWidth = 2;
            ctx.strokeRect(6, 8, 20, 16);
            ctx.strokeStyle = '#d946ef';
            ctx.strokeRect(10, 12, 12, 8);

            // Center hash hash mark (Genesis cube)
            ctx.fillStyle = '#facc15';
            ctx.fillRect(14, 14, 4, 4);

            scene.textures.addCanvas('tile_blockchain', canvas);
        }

        // Tile 3: Proprietary Vault Sector (Stealth Matte Metal with Warning Stripes)
        {
            const { canvas, ctx } = this.createCanvas(32, 32);
            ctx.fillStyle = '#18181b';
            ctx.fillRect(0, 0, 32, 32);

            // Warning diagonal stripes on top ledge
            for (let x = -8; x < 40; x += 8) {
                ctx.fillStyle = '#e11d48';
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x + 5, 0);
                ctx.lineTo(x, 5);
                ctx.lineTo(x - 5, 5);
                ctx.fill();
            }

            // Laser conduit line
            ctx.fillStyle = '#f43f5e';
            ctx.fillRect(0, 6, 32, 1);

            // Heavy security bolts
            ctx.fillStyle = '#3f3f46';
            ctx.fillRect(4, 12, 4, 4);
            ctx.fillRect(24, 12, 4, 4);
            ctx.fillRect(4, 24, 4, 4);
            ctx.fillRect(24, 24, 4, 4);

            scene.textures.addCanvas('tile_proprietary', canvas);
        }

        // Tile 4: Innovation Nexus Platform (Iridescent Neon Teal / Magenta Glass)
        {
            const { canvas, ctx } = this.createCanvas(32, 32);
            // Glass translucent gradient
            const grad = ctx.createLinearGradient(0, 0, 0, 32);
            grad.addColorStop(0, '#042f2e');
            grad.addColorStop(1, '#111827');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 32, 32);

            // Glowing teal edge
            ctx.fillStyle = '#2dd4bf';
            ctx.fillRect(0, 0, 32, 2);
            ctx.fillStyle = '#f43f5e';
            ctx.fillRect(0, 2, 32, 1);

            // Holographic grid
            ctx.strokeStyle = 'rgba(45, 212, 191, 0.25)';
            ctx.lineWidth = 1;
            ctx.strokeRect(4, 6, 24, 22);
            ctx.beginPath();
            ctx.moveTo(16, 6);
            ctx.lineTo(16, 28);
            ctx.moveTo(4, 17);
            ctx.lineTo(28, 17);
            ctx.stroke();

            scene.textures.addCanvas('tile_nexus', canvas);
        }

        // Floating Thin Platform (32x12)
        {
            const { canvas, ctx } = this.createCanvas(32, 12);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, 32, 12);
            ctx.fillStyle = '#00f0ff';
            ctx.fillRect(0, 0, 32, 2);
            // Thruster exhausts
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(4, 10, 6, 2);
            ctx.fillRect(22, 10, 6, 2);
            scene.textures.addCanvas('tile_floating', canvas);
        }

        // Spring Bounce Pad (32x16)
        {
            const { canvas, ctx } = this.createCanvas(32, 16);
            // Base plate
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(2, 12, 28, 4);
            // Neon coil
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(8, 12);
            ctx.lineTo(16, 7);
            ctx.lineTo(24, 12);
            ctx.stroke();
            // Launch plate
            ctx.fillStyle = '#4ade80';
            ctx.fillRect(4, 4, 24, 4);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(8, 5, 16, 2);
            scene.textures.addCanvas('tile_spring', canvas);
        }

        // Hazard Spikes (16x16)
        {
            const { canvas, ctx } = this.createCanvas(16, 16);
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(0, 16);
            ctx.lineTo(4, 2);
            ctx.lineTo(8, 16);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(8, 16);
            ctx.lineTo(12, 2);
            ctx.lineTo(16, 16);
            ctx.fill();

            // Glow core
            ctx.fillStyle = '#fca5a5';
            ctx.fillRect(3, 4, 2, 4);
            ctx.fillRect(11, 4, 2, 4);
            scene.textures.addCanvas('tile_spikes', canvas);
        }
    }

    // ==========================================
    // 3. COLLECTIBLES & POWERUPS
    // ==========================================
    static generateCollectibles(scene) {
        // 1. Kernel Chip (16x16, 4 frames rotation)
        for (let i = 0; i < 4; i++) {
            const { canvas, ctx } = this.createCanvas(16, 16);
            const scaleX = [1, 0.6, 0.2, 0.6][i];
            ctx.save();
            ctx.translate(8, 8);
            ctx.scale(scaleX, 1);

            // Chip body
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(-6, -6, 12, 12);
            // Core die
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(-3, -3, 6, 6);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-1, -1, 2, 2);

            // Pins
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(-7, -4, 1, 2);
            ctx.fillRect(-7, 2, 1, 2);
            ctx.fillRect(6, -4, 1, 2);
            ctx.fillRect(6, 2, 1, 2);

            ctx.restore();
            scene.textures.addCanvas(`coin_kernel_${i}`, canvas);
        }

        // 2. Blockchain Crystal Token (16x16, 4 frames rotation)
        for (let i = 0; i < 4; i++) {
            const { canvas, ctx } = this.createCanvas(16, 16);
            const scaleX = [1, 0.6, 0.15, 0.6][i];
            ctx.save();
            ctx.translate(8, 8);
            ctx.scale(scaleX, 1);

            // Diamond crystal
            ctx.fillStyle = '#d946ef';
            ctx.beginPath();
            ctx.moveTo(0, -7);
            ctx.lineTo(6, 0);
            ctx.lineTo(0, 7);
            ctx.lineTo(-6, 0);
            ctx.closePath();
            ctx.fill();

            // Inner facet
            ctx.fillStyle = '#f472b6';
            ctx.beginPath();
            ctx.moveTo(0, -5);
            ctx.lineTo(4, 0);
            ctx.lineTo(0, 5);
            ctx.lineTo(-4, 0);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-1, -2, 2, 4);

            ctx.restore();
            scene.textures.addCanvas(`coin_crypto_${i}`, canvas);
        }

        // 3. Secret Dossier (Proprietary Document Capsule - 20x20)
        {
            const { canvas, ctx } = this.createCanvas(20, 20);
            // Floppy / Secret dossier binder
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(2, 2, 16, 16);
            // Redacted tape
            ctx.fillStyle = '#111827';
            ctx.fillRect(4, 6, 12, 3);
            ctx.fillRect(4, 11, 8, 3);
            // Warning lock
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(12, 11, 4, 4);
            // Glint
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(3, 3, 2, 2);
            scene.textures.addCanvas('secret_dossier', canvas);
        }

        // 4. Overclock Battery Power-up (16x20)
        {
            const { canvas, ctx } = this.createCanvas(16, 20);
            // Battery shell
            ctx.fillStyle = '#059669';
            ctx.fillRect(2, 4, 12, 14);
            // Terminal top
            ctx.fillStyle = '#10b981';
            ctx.fillRect(5, 1, 6, 3);
            // Lightning bolt / overclock icon
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.moveTo(9, 6);
            ctx.lineTo(5, 12);
            ctx.lineTo(9, 12);
            ctx.lineTo(7, 16);
            ctx.lineTo(12, 10);
            ctx.lineTo(8, 10);
            ctx.closePath();
            ctx.fill();
            scene.textures.addCanvas('powerup_battery', canvas);
        }
    }

    // ==========================================
    // 4. ENEMIES & HAZARDS
    // ==========================================
    static generateEnemies(scene) {
        // Glitch Bug (24x20, 2 frames walking)
        for (let frame = 0; frame < 2; frame++) {
            const { canvas, ctx } = this.createCanvas(24, 20);
            const legOffset = frame === 0 ? 0 : 2;

            // Bug Body (glitching red/magenta matrix)
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(5, 6, 14, 9);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(7, 7, 10, 7);

            // Glowing evil glitch eye
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(13, 8, 4, 3);
            ctx.fillStyle = '#000000';
            ctx.fillRect(15, 9, 2, 2);

            // Antennae
            ctx.fillStyle = '#f43f5e';
            ctx.fillRect(15, 2, 2, 4);
            ctx.fillRect(17, 1, 2, 2);

            // Legs
            ctx.fillStyle = '#991b1b';
            // Leg 1
            ctx.fillRect(3, 11 + legOffset, 2, 6);
            // Leg 2
            ctx.fillRect(10, 13 - legOffset, 2, 6);
            // Leg 3
            ctx.fillRect(19, 11 + legOffset, 2, 6);

            // Glitch digital artifact sparks
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(1, 4, 2, 2);
            ctx.fillRect(21, 14, 2, 2);

            scene.textures.addCanvas(`enemy_bug_${frame}`, canvas);
        }

        // Security Drone (28x20, 2 frames hovering)
        for (let frame = 0; frame < 2; frame++) {
            const { canvas, ctx } = this.createCanvas(28, 20);
            const hover = frame === 0 ? 0 : 1;

            // Drone spherical hull
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(6, 4 + hover, 16, 10);
            ctx.fillStyle = '#334155';
            ctx.fillRect(8, 5 + hover, 12, 8);

            // Sweeping laser sensor eye
            ctx.fillStyle = '#e11d48';
            ctx.fillRect(11, 7 + hover, 6, 4);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(13, 8 + hover, 2, 2);

            // Rotors / Antigravity thrusters
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(2, 2 + hover, 6, 2);
            ctx.fillRect(20, 2 + hover, 6, 2);

            // Scanning laser cone under drone
            ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
            ctx.beginPath();
            ctx.moveTo(14, 14 + hover);
            ctx.lineTo(4, 20);
            ctx.lineTo(24, 20);
            ctx.closePath();
            ctx.fill();

            scene.textures.addCanvas(`enemy_drone_${frame}`, canvas);
        }
    }

    // ==========================================
    // 5. INTERACTIVE OBJECTS & TERMINALS
    // ==========================================
    static generateInteractiveObjects(scene) {
        // Holographic Terminal (32x48)
        {
            const { canvas, ctx } = this.createCanvas(32, 48);

            // Sleek pedestal stand
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(8, 24, 16, 20);
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(10, 26, 12, 16);
            ctx.fillStyle = '#00f0ff';
            ctx.fillRect(6, 44, 20, 4); // base plate

            // Glowing terminal keyboard / console
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(8, 22, 16, 4);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(10, 23, 12, 2);

            // Floating holographic screen
            ctx.fillStyle = 'rgba(6, 182, 212, 0.35)';
            ctx.fillRect(4, 2, 24, 18);
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 1;
            ctx.strokeRect(4, 2, 24, 18);

            // Holographic code lines
            ctx.fillStyle = '#67e8f9';
            ctx.fillRect(7, 5, 14, 2);
            ctx.fillRect(7, 9, 18, 2);
            ctx.fillRect(7, 13, 10, 2);

            // Prompt icon "[E]" indicator
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(13, -2, 6, 2);

            scene.textures.addCanvas('terminal_pedestal', canvas);
        }

        // Checkpoint Totem: Inactive (24x48)
        {
            const { canvas, ctx } = this.createCanvas(24, 48);
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(8, 8, 8, 36);
            ctx.fillStyle = '#334155';
            ctx.fillRect(4, 44, 16, 4);
            // Inactive amber crystal
            ctx.fillStyle = '#d97706';
            ctx.fillRect(6, 2, 12, 8);
            ctx.fillStyle = '#b45309';
            ctx.fillRect(8, 4, 8, 4);
            scene.textures.addCanvas('checkpoint_off', canvas);
        }

        // Checkpoint Totem: Active (24x48)
        {
            const { canvas, ctx } = this.createCanvas(24, 48);
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(8, 8, 8, 36);
            ctx.fillStyle = '#00f0ff';
            ctx.fillRect(10, 10, 4, 32); // Glowing conduit
            ctx.fillStyle = '#334155';
            ctx.fillRect(4, 44, 16, 4);
            // Active brilliant cyan crystal with beacon light
            ctx.fillStyle = '#00f0ff';
            ctx.fillRect(6, 2, 12, 8);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(9, 4, 6, 4);
            scene.textures.addCanvas('checkpoint_on', canvas);
        }

        // Grand Finish Portal / Uplink Nexus (64x96)
        {
            const { canvas, ctx } = this.createCanvas(64, 96);
            // Giant cyber archway
            const grad = ctx.createLinearGradient(0, 0, 64, 96);
            grad.addColorStop(0, '#ec4899');
            grad.addColorStop(0.5, '#8b5cf6');
            grad.addColorStop(1, '#06b6d4');

            ctx.strokeStyle = grad;
            ctx.lineWidth = 6;
            ctx.strokeRect(6, 6, 52, 86);

            // Glowing vortex interior
            ctx.fillStyle = 'rgba(139, 92, 246, 0.25)';
            ctx.fillRect(10, 10, 44, 80);

            // Swirl concentric frames
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2;
            ctx.strokeRect(16, 16, 32, 68);
            ctx.strokeStyle = '#f43f5e';
            ctx.strokeRect(22, 22, 20, 56);

            // Uplink Text header
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 8px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('UPLINK', 32, 20);

            scene.textures.addCanvas('portal_finish', canvas);
        }
    }

    // ==========================================
    // 6. PARTICLES
    // ==========================================
    static generateParticles(scene) {
        // Spark
        {
            const { canvas, ctx } = this.createCanvas(8, 8);
            ctx.fillStyle = '#00f0ff';
            ctx.fillRect(2, 0, 4, 8);
            ctx.fillRect(0, 2, 8, 4);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(2, 2, 4, 4);
            scene.textures.addCanvas('particle_spark', canvas);
        }

        // Binary '0'
        {
            const { canvas, ctx } = this.createCanvas(8, 10);
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(1, 1, 6, 8);
            scene.textures.addCanvas('particle_bin_0', canvas);
        }

        // Binary '1'
        {
            const { canvas, ctx } = this.createCanvas(8, 10);
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(3, 1, 2, 8);
            ctx.fillRect(1, 2, 3, 2);
            ctx.fillRect(1, 7, 6, 2);
            scene.textures.addCanvas('particle_bin_1', canvas);
        }

        // Dash cloud
        {
            const { canvas, ctx } = this.createCanvas(16, 16);
            ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(8, 8, 7, 0, Math.PI * 2);
            ctx.fill();
            scene.textures.addCanvas('particle_dash', canvas);
        }
    }

    // ==========================================
    // 7. PARALLAX BACKGROUND TEXTURES
    // ==========================================
    static generateBackgrounds(scene) {
        // Background Layer 1: Deep Space & Cyber Horizon Grid (512x384)
        {
            const { canvas, ctx } = this.createCanvas(512, 384);
            // Gradient sky
            const skyGrad = ctx.createLinearGradient(0, 0, 0, 384);
            skyGrad.addColorStop(0, '#030712');   // Deep space
            skyGrad.addColorStop(0.55, '#1e1b4b'); // Cyber dusk
            skyGrad.addColorStop(0.75, '#4c1d95'); // Magenta horizon
            skyGrad.addColorStop(0.9, '#831843');  // Sunset glow
            skyGrad.addColorStop(1, '#050510');
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, 512, 384);

            // Cyber Sun on Horizon
            const sunGrad = ctx.createLinearGradient(0, 160, 0, 270);
            sunGrad.addColorStop(0, '#fde047');
            sunGrad.addColorStop(0.5, '#ec4899');
            sunGrad.addColorStop(1, '#7e22ce');
            ctx.fillStyle = sunGrad;
            ctx.beginPath();
            ctx.arc(256, 220, 60, Math.PI, 0, false);
            ctx.fill();

            // Horizontal sun slice cuts
            ctx.fillStyle = '#4c1d95';
            for (let y = 190; y < 225; y += 6) {
                const h = 2 + (y - 190) * 0.1;
                ctx.fillRect(180, y, 150, h);
            }

            // Distant wireframe neon mountain ranges
            ctx.strokeStyle = '#a855f7';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, 240);
            ctx.lineTo(80, 190);
            ctx.lineTo(150, 230);
            ctx.lineTo(240, 175);
            ctx.lineTo(330, 235);
            ctx.lineTo(410, 185);
            ctx.lineTo(512, 240);
            ctx.stroke();

            // Horizon Grid (Synthwave perspective grid)
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
            ctx.lineWidth = 1;
            // Horizontal perspective lines
            for (let y = 240; y < 384; y += (y - 230) * 0.28 + 3) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(512, y);
                ctx.stroke();
            }
            // Vanishing perspective rays from center
            for (let x = -200; x <= 712; x += 40) {
                ctx.beginPath();
                ctx.moveTo(256, 240);
                ctx.lineTo(x, 384);
                ctx.stroke();
            }

            // Stars
            ctx.fillStyle = '#ffffff';
            for (let s = 0; s < 50; s++) {
                const sx = (s * 97) % 512;
                const sy = (s * 67) % 180;
                ctx.fillRect(sx, sy, 1.5, 1.5);
            }

            scene.textures.addCanvas('bg_stars_grid', canvas);
        }

        // Background Layer 2: Midground Cyber City Skyline & Circuit Towers (512x384)
        {
            const { canvas, ctx } = this.createCanvas(512, 384);
            // Transparent background
            ctx.clearRect(0, 0, 512, 384);

            // Array of stylized cyber skyscrapers & data servers
            const towers = [
                { x: 0, w: 45, h: 180 },
                { x: 50, w: 35, h: 220 },
                { x: 90, w: 55, h: 160 },
                { x: 150, w: 40, h: 240 },
                { x: 195, w: 60, h: 200 },
                { x: 260, w: 40, h: 170 },
                { x: 305, w: 50, h: 250 },
                { x: 360, w: 35, h: 190 },
                { x: 400, w: 65, h: 230 },
                { x: 470, w: 45, h: 180 },
            ];

            towers.forEach(t => {
                const y = 384 - t.h;
                // Building silhouette
                ctx.fillStyle = '#090d16';
                ctx.fillRect(t.x, y, t.w, t.h);

                // Neon roof antenna
                ctx.fillStyle = '#06b6d4';
                ctx.fillRect(t.x + Math.floor(t.w / 2), y - 16, 2, 16);
                ctx.fillStyle = '#f43f5e';
                ctx.fillRect(t.x + Math.floor(t.w / 2) - 1, y - 18, 4, 3);

                // Server rack / cyber window columns
                ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
                for (let wy = y + 15; wy < 380; wy += 14) {
                    for (let wx = t.x + 6; wx < t.x + t.w - 6; wx += 8) {
                        if (Math.random() > 0.3) {
                            ctx.fillRect(wx, wy, 4, 6);
                        }
                    }
                }

                // Vertical glowing edge
                ctx.fillStyle = '#1e1b4b';
                ctx.fillRect(t.x, y, 2, t.h);
            });

            scene.textures.addCanvas('bg_skyscrapers', canvas);
        }
    }

    // ==========================================
    // 8. REGISTER PHASER ANIMATIONS
    // ==========================================
    static registerAnimations(scene) {
        // Player Idle
        scene.anims.create({
            key: 'p_idle',
            frames: [
                { key: 'player_idle_0' },
                { key: 'player_idle_1' },
                { key: 'player_idle_2' },
                { key: 'player_idle_3' }
            ],
            frameRate: 6,
            repeat: -1
        });

        // Player Run
        scene.anims.create({
            key: 'p_run',
            frames: [
                { key: 'player_run_0' },
                { key: 'player_run_1' },
                { key: 'player_run_2' },
                { key: 'player_run_3' },
                { key: 'player_run_4' },
                { key: 'player_run_5' }
            ],
            frameRate: 12,
            repeat: -1
        });

        // Rotating Kernel Coins
        scene.anims.create({
            key: 'anim_coin_kernel',
            frames: [
                { key: 'coin_kernel_0' },
                { key: 'coin_kernel_1' },
                { key: 'coin_kernel_2' },
                { key: 'coin_kernel_3' }
            ],
            frameRate: 7,
            repeat: -1
        });

        // Rotating Crypto Coins
        scene.anims.create({
            key: 'anim_coin_crypto',
            frames: [
                { key: 'coin_crypto_0' },
                { key: 'coin_crypto_1' },
                { key: 'coin_crypto_2' },
                { key: 'coin_crypto_3' }
            ],
            frameRate: 7,
            repeat: -1
        });

        // Bug Glitch Enemy
        scene.anims.create({
            key: 'anim_bug',
            frames: [
                { key: 'enemy_bug_0' },
                { key: 'enemy_bug_1' }
            ],
            frameRate: 6,
            repeat: -1
        });

        // Security Drone
        scene.anims.create({
            key: 'anim_drone',
            frames: [
                { key: 'enemy_drone_0' },
                { key: 'enemy_drone_1' }
            ],
            frameRate: 4,
            repeat: -1
        });
    }
}

window.SpriteGenerator = SpriteGenerator;

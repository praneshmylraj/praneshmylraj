/**
 * Scenic World Generator for Pranesh's Lo-Fi Cycling Journey
 * Builds a continuous, serene road lined with streetlamps, blossoming trees, and 7 career pavilions.
 */

class WorldBuilder {
    static build(scene) {
        const platforms = scene.platforms;
        const stations = scene.stations;
        const milestones = window.RESUME_DATA.milestones;

        const worldWidth = scene.worldWidth;
        const roadY = 460;

        // 1. Continuous Smooth Road
        for (let x = 0; x < worldWidth; x += 64) {
            const tile = platforms.create(x, roadY, 'road_tile');
            tile.setOrigin(0, 0);
            tile.refreshBody();
        }

        // 2. Street Lamps & Trees along the route
        for (let x = 150; x < worldWidth - 200; x += 320) {
            // Street lamp
            const lamp = scene.add.sprite(x, roadY - 45, 'street_lamp');
            lamp.setOrigin(0.5, 0.5);

            // Flowering tree every second lamp
            if (x % 640 === 150) {
                const tree = scene.add.sprite(x + 140, roadY - 45, 'lofi_tree');
                tree.setOrigin(0.5, 0.5);
                tree.setAlpha(0.9);
            }
        }

        // 3. Career Milestone Pavilions
        const stationPositions = [
            600,   // 01: Profile & Contact
            2200,  // 02: Senior SWE (VegaOS, 10K+ TPS, Bedrock AI)
            4000,  // 03: SWE II (DevTools CLI, Device Lifecycle)
            5800,  // 04: SWE I & Intern (DEX Bytecode, Streaming, Appstore)
            7600,  // 05: Technical Arsenal
            9400,  // 06: Education & Early Roots
            11000  // 07: Let's Connect Lookout
        ];

        milestones.forEach((milestone, idx) => {
            const posX = stationPositions[idx] || (idx * 1600 + 600);
            const station = new MilestonePavilion(scene, posX, roadY, milestone);
            stations.push(station);
        });

        // 4. Drifting Blossom Petals Particle System
        const petalEmitter = scene.add.particles(0, 0, 'particle_petal', {
            x: { min: 0, max: scene.cameras.main.width },
            y: -10,
            lifespan: 8000,
            speedY: { min: 20, max: 45 },
            speedX: { min: 30, max: 80 },
            scale: { start: 0.8, end: 0.4 },
            alpha: { start: 0.8, end: 0 },
            rotate: { min: 0, max: 360 },
            frequency: 400
        });
        petalEmitter.setScrollFactor(0); // Fixed screen ambient particles
    }
}

window.WorldBuilder = WorldBuilder;

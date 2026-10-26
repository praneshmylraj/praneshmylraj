/**
 * World Generation for Sunset Lo-Fi Cycling Journey
 * Beautiful scenery with telegraph poles, flowering trees, streetlamps, and 7 pavilions.
 */

class WorldBuilder {
    static build(scene) {
        const platforms = scene.platforms;
        const stations = scene.stations;
        const milestones = window.RESUME_DATA.milestones;

        const worldWidth = scene.worldWidth;
        const roadY = 460;

        // 1. Continuous Smooth Asphalt Road
        for (let x = 0; x < worldWidth; x += 64) {
            const tile = platforms.create(x, roadY, 'road_tile');
            tile.setOrigin(0, 0);
            tile.refreshBody();
        }

        // 2. Scenic Roadside Decor (Street Lamps, Trees, Telegraph Poles)
        for (let x = 120; x < worldWidth - 300; x += 280) {
            // Street lamp with warm light cone
            const lamp = scene.add.sprite(x, roadY - 48, 'street_lamp');
            lamp.setOrigin(0.5, 0.5);

            // Telegraph pole every 3rd lamp
            if (x % 840 === 120) {
                const pole = scene.add.sprite(x + 110, roadY - 58, 'telegraph_pole');
                pole.setOrigin(0.5, 0.5);
                pole.setAlpha(0.85);
            }

            // Flowering sunset tree
            if (x % 560 === 400) {
                const tree = scene.add.sprite(x + 130, roadY - 50, 'lofi_tree');
                tree.setOrigin(0.5, 0.5);
                tree.setAlpha(0.92);
            }
        }

        // 3. 7 Career Milestone Pavilions
        const stationPositions = [
            700,    // 01: Profile & Contact
            2600,   // 02: Senior SWE (VegaOS, 10K+ TPS, Bedrock AI)
            4600,   // 03: SWE II (DevTools CLI, Device Lifecycle)
            6600,   // 04: SWE I & Intern (DEX Bytecode, Streaming, Appstore)
            8600,   // 05: Technical Arsenal
            10600,  // 06: Education & Early Roots
            12600   // 07: Sunset Lookout // Let's Connect
        ];

        milestones.forEach((milestone, idx) => {
            const posX = stationPositions[idx] || (idx * 2000 + 700);
            const station = new MilestonePavilion(scene, posX, roadY, milestone);
            stations.push(station);
        });

        // 4. Ambient Floating Golden Fireflies
        scene.add.particles(0, 0, 'particle_firefly', {
            x: { min: 0, max: scene.cameras.main.width },
            y: { min: 100, max: 460 },
            lifespan: 6000,
            speedY: { min: -12, max: 12 },
            speedX: { min: 10, max: 35 },
            scale: { start: 0.8, end: 0.2 },
            alpha: { start: 0.9, end: 0 },
            frequency: 500
        }).setScrollFactor(0);

        // 5. Ambient Falling Blossom Petals
        scene.add.particles(0, 0, 'particle_petal', {
            x: { min: 0, max: scene.cameras.main.width },
            y: -10,
            lifespan: 8000,
            speedY: { min: 18, max: 40 },
            speedX: { min: 25, max: 65 },
            scale: { start: 0.9, end: 0.4 },
            alpha: { start: 0.85, end: 0 },
            rotate: { min: 0, max: 360 },
            frequency: 450
        }).setScrollFactor(0);
    }
}

window.WorldBuilder = WorldBuilder;

/**
 * World Generation & Level Layout for Pranesh's World Runner
 * Builds 4 distinct thematic zones across a 10,000-pixel cyber terrain!
 */

class WorldBuilder {
    static build(scene) {
        const platforms = scene.platforms;
        const hazards = scene.hazards;
        const collectibles = scene.collectibles;
        const terminals = scene.terminals;
        const checkpoints = scene.checkpoints;
        const enemies = scene.enemies;
        const bouncePads = scene.bouncePads;
        const movingPlatforms = scene.movingPlatforms;

        // Helper to spawn solid tile block
        const addGround = (startX, startY, tileCountX, tileCountY = 2, tileType = 'tile_kernel') => {
            for (let ix = 0; ix < tileCountX; ix++) {
                for (let iy = 0; iy < tileCountY; iy++) {
                    const x = startX + ix * 32;
                    const y = startY + iy * 32;
                    const tile = platforms.create(x, y, tileType);
                    tile.setOrigin(0, 0);
                    tile.refreshBody();
                }
            }
        };

        // Helper to spawn coins in arc or row
        const addCoins = (startX, y, count, step = 36, type = 'kernel') => {
            for (let i = 0; i < count; i++) {
                const coin = scene.physics.add.sprite(startX + i * step, y, type === 'kernel' ? 'coin_kernel_0' : 'coin_crypto_0');
                coin.coinType = type;
                coin.body.allowGravity = false;
                coin.play(type === 'kernel' ? 'anim_coin_kernel' : 'anim_coin_crypto');
                collectibles.add(coin);

                // Gentle floating bob
                scene.tweens.add({
                    targets: coin,
                    y: y - 8,
                    duration: 1200 + (i * 120),
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        };

        // Helper to spawn secret dossier
        const addSecret = (x, y, id) => {
            const secret = scene.physics.add.sprite(x, y, 'secret_dossier');
            secret.secretId = id;
            secret.body.allowGravity = false;
            scene.secrets.add(secret);

            scene.tweens.add({
                targets: secret,
                y: y - 10,
                duration: 900,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        };

        // Helper to spawn powerup battery
        const addPowerup = (x, y) => {
            const battery = scene.physics.add.sprite(x, y, 'powerup_battery');
            battery.body.allowGravity = false;
            battery.isBattery = true;
            collectibles.add(battery);

            scene.tweens.add({
                targets: battery,
                angle: 10,
                duration: 600,
                yoyo: true,
                repeat: -1
            });
        };

        // Helper to spawn bounce pad
        const addSpring = (x, y) => {
            const spring = scene.physics.add.sprite(x, y, 'tile_spring');
            spring.body.allowGravity = false;
            spring.body.immovable = true;
            bouncePads.add(spring);
        };

        // ====================================================
        // ZONE 1: THE SILICON & KERNEL DEPTHS (X: 0 - 2,500)
        // Theme: OS Internals, Microkernels, Assembly, Silicon
        // ====================================================

        // Initial landing platform
        addGround(0, 480, 24, 4, 'tile_kernel');
        addCoins(200, 430, 6, 36, 'kernel');

        // Terminal 1: System Boot Lore
        terminals.push(new LoreTerminal(scene, 380, 448, {
            title: "TERMINAL 01 // KERNEL CORE",
            author: "Pranesh (@praneshmylraj)",
            tag: "LOW-LEVEL SYSTEMS",
            content: "👋 Welcome to my digital workspace!\n\n'I’m interested in software — everything software, from operating systems to blockchains.'\n\nTips:\n• Use [A]/[D] or Arrow keys to move\n• [SPACE] to Jump, press again in mid-air to Double Jump!\n• Press [SHIFT] or [J] to CYBER DASH through obstacles!",
            link: null
        }));

        // Stepping platforms with small gaps
        addGround(850, 440, 6, 2, 'tile_kernel');
        addCoins(870, 390, 4, 34, 'kernel');

        // Bug patrol on kernel
        enemies.add(new GlitchBug(scene, 920, 410, 100));

        // High ledge with secret
        addGround(1120, 360, 5, 2, 'tile_kernel');
        addSecret(1190, 310, 1);

        // Ground continuation
        addGround(1350, 480, 14, 4, 'tile_kernel');
        addCoins(1400, 430, 8, 36, 'kernel');
        enemies.add(new GlitchBug(scene, 1480, 450, 180));

        // Jump Spring over hazard pit
        addSpring(1750, 464);

        // Hazard spikes pit
        for (let sp = 1820; sp < 2000; sp += 16) {
            const spike = hazards.create(sp, 530, 'tile_spikes');
            spike.setOrigin(0, 0);
            spike.refreshBody();
        }

        // Floating CPU register bridges
        addGround(1880, 330, 5, 1, 'tile_kernel');
        addCoins(1900, 280, 3, 36, 'kernel');

        addGround(2100, 420, 10, 3, 'tile_kernel');
        addPowerup(2160, 370);

        // Checkpoint 1
        const cp1 = new CheckpointBeacon(scene, 2350, 372, 1);
        checkpoints.push(cp1);


        // ====================================================
        // ZONE 2: BLOCKCHAIN CONSENSUS EXPANSE (X: 2,500 - 5,200)
        // Theme: Distributed Ledgers, Smart Contracts, Gas, Nodes
        // ====================================================

        // Genesis Block
        addGround(2500, 450, 10, 3, 'tile_blockchain');
        addCoins(2550, 400, 6, 36, 'crypto');

        // Terminal 2: Blockchain Architecture
        terminals.push(new LoreTerminal(scene, 2750, 418, {
            title: "TERMINAL 02 // BLOCKCHAIN PROTOCOL",
            author: "Consensus Engine",
            tag: "DISTRIBUTED LEDGERS",
            content: "Consensus Protocol Status: ONLINE.\n\nFrom smart contracts to zero-knowledge rollups, decentralized infrastructure eliminates central points of failure.\n\nCollect cryptographic tokens and leap across verified blocks!",
            link: null
        }));

        // Moving Block Platform 1
        movingPlatforms.push(new MovingPlatform(scene, 2900, 420, 160, 0, 2800));

        // Block #1
        addGround(3160, 380, 7, 2, 'tile_blockchain');
        addCoins(3180, 330, 5, 36, 'crypto');
        enemies.add(new GlitchBug(scene, 3200, 350, 120));

        // High aerial chain block with Secret Dossier 2
        addGround(3350, 250, 4, 1, 'tile_blockchain');
        addSecret(3400, 200, 2);

        // Security drone patrolling the skies
        enemies.add(new SecurityDrone(scene, 3550, 330, 90));

        // Descending block stairs
        addGround(3500, 460, 8, 3, 'tile_blockchain');
        addCoins(3540, 410, 6, 36, 'crypto');

        // Spring launcher to sky platform
        addSpring(3800, 444);

        addGround(3900, 290, 8, 2, 'tile_blockchain');
        addCoins(3930, 240, 5, 36, 'crypto');
        enemies.add(new SecurityDrone(scene, 4150, 260, 70));

        // Moving Block Platform 2 (Vertical)
        movingPlatforms.push(new MovingPlatform(scene, 4250, 430, 0, -140, 3200));

        addGround(4400, 450, 12, 3, 'tile_blockchain');
        addCoins(4450, 400, 8, 36, 'crypto');
        enemies.add(new GlitchBug(scene, 4520, 420, 200));

        // Powerup
        addPowerup(4800, 400);

        // Checkpoint 2
        const cp2 = new CheckpointBeacon(scene, 5050, 402, 2);
        checkpoints.push(cp2);


        // ====================================================
        // ZONE 3: CLASSIFIED PROPRIETARY VAULT (X: 5,200 - 7,600)
        // Theme: "learning alot of things that are proprietary (sshhh)"
        // Heavy stealth hazard stripes, laser grids, redacted data
        // ====================================================

        addGround(5200, 480, 14, 4, 'tile_proprietary');

        // Terminal 3: The Secret Vault Lore
        terminals.push(new LoreTerminal(scene, 5450, 448, {
            title: "TERMINAL 03 // CLASSIFIED ARCHIVES",
            author: "Clearance: OMEGA",
            tag: "TOP SECRET",
            content: "🔒 Vault Security Clearance Granted.\n\n'🌱 I’m currently learning alot of things that are proprietary (sshhh can't share them here!)'\n\nCutting-edge architectures, proprietary research, and next-gen runtime systems. Watch out for high-speed laser sentinels!",
            link: null
        }));

        addCoins(5350, 430, 6, 36, 'kernel');

        // Low overhang tunnel requiring Slide or Dash
        addGround(5700, 480, 16, 4, 'tile_proprietary');
        addGround(5760, 410, 8, 2, 'tile_proprietary'); // Low ceiling!
        addCoins(5780, 455, 6, 30, 'crypto');

        // Glitch bug patrolling right after low ceiling
        enemies.add(new GlitchBug(scene, 6100, 450, 140));

        // Floating hazardous ledges
        addGround(6300, 390, 5, 2, 'tile_proprietary');
        addSecret(6370, 340, 3); // Secret Dossier 3

        // Drone guarding the gap
        enemies.add(new SecurityDrone(scene, 6500, 360, 110));

        // Spring over spike bed
        addGround(6600, 470, 4, 3, 'tile_proprietary');
        addSpring(6700, 454);

        for (let sp = 6760; sp < 6960; sp += 16) {
            const spike = hazards.create(sp, 520, 'tile_spikes');
            spike.setOrigin(0, 0);
            spike.refreshBody();
        }

        // Aerial high vault platform
        addGround(6850, 310, 7, 2, 'tile_proprietary');
        addCoins(6880, 260, 5, 36, 'kernel');
        addSecret(7020, 260, 4); // Secret Dossier 4

        addGround(7150, 450, 12, 3, 'tile_proprietary');
        enemies.add(new GlitchBug(scene, 7250, 420, 160));
        addPowerup(7450, 400);

        // Checkpoint 3
        const cp3 = new CheckpointBeacon(scene, 7550, 402, 3);
        checkpoints.push(cp3);


        // ====================================================
        // ZONE 4: INNOVATION SUMMIT & UPLINK HUB (X: 7,600 - 10,000)
        // Theme: LetsBeFriends, Nalam, Misty Plugins, Contact Uplink
        // Iridescent Glass, Synthwave Sunset, Triumphant finale
        // ====================================================

        addGround(7700, 460, 12, 3, 'tile_nexus');
        addCoins(7750, 410, 7, 36, 'crypto');

        // Terminal 4: Projects Showcase (LetsBeFriends & Nalam)
        terminals.push(new LoreTerminal(scene, 7950, 428, {
            title: "TERMINAL 04 // PROJECT ECOSYSTEM",
            author: "Innovation Hub",
            tag: "OPEN SOURCE & BEYOND",
            content: "Active Projects Portfolio:\n\n• LetsBeFriends: High-speed connection & community platform\n• Nalam: Digital health & intelligent wellness architecture\n• Misty Plugins: Modular agent ingestion and analytics extensions\n\nFull stack mastery from bare metal to user experience!",
            link: null
        }));

        // Floating glass bridge series
        addGround(8200, 420, 6, 2, 'tile_nexus');
        addCoins(8220, 370, 4, 36, 'crypto');

        movingPlatforms.push(new MovingPlatform(scene, 8450, 400, 180, 0, 2600));

        addGround(8750, 370, 7, 2, 'tile_nexus');
        addCoins(8780, 320, 5, 36, 'crypto');
        addSecret(8900, 320, 5); // Secret Dossier 5 (Final Secret!)

        // Grand Summit Plateau
        addGround(9150, 440, 26, 4, 'tile_nexus');
        addCoins(9220, 390, 8, 36, 'crypto');

        // Terminal 5: The Contact Uplink
        terminals.push(new LoreTerminal(scene, 9450, 408, {
            title: "TERMINAL 05 // CONTACT UPLINK",
            author: "Pranesh (@praneshmylraj)",
            tag: "CONNECT",
            content: "📫 Transmission Channel Open!\n\nEmail: inboxpranesh@gmail.com\nGitHub: github.com/praneshmylraj\n\nInterested in building operating systems, high-throughput distributed protocols, or innovative software products? Let's connect!",
            link: "mailto:inboxpranesh@gmail.com"
        }));

        // Grand Portal Archway (Victory trigger)
        const portal = scene.physics.add.sprite(9850, 392, 'portal_finish');
        portal.body.allowGravity = false;
        portal.body.immovable = true;
        scene.finishPortal = portal;

        // Swirling portal aura tween
        scene.tweens.add({
            targets: portal,
            scaleY: 1.05,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
}

window.WorldBuilder = WorldBuilder;

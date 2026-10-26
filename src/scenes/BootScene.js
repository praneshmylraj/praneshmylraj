/**
 * Boot Scene - Sunset Warm Aesthetic
 */

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    create() {
        SpriteGenerator.generateAll(this);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Sunset Sky & Village Hills
        this.add.image(width / 2, height / 2, 'bg_sunset_sky').setDisplaySize(width, height);
        this.add.image(width / 2, height - 120, 'bg_village_hills').setDisplaySize(width, 260).setAlpha(0.85);

        // Ambient Fireflies on Title Screen
        this.add.particles(0, 0, 'particle_firefly', {
            x: { min: 0, max: width },
            y: { min: 80, max: 480 },
            lifespan: 5000,
            speedY: { min: -10, max: 10 },
            speedX: { min: 10, max: 30 },
            scale: { start: 0.9, end: 0.2 },
            alpha: { start: 0.9, end: 0 },
            frequency: 400
        });

        // Center Welcome Card
        const titleCard = this.add.container(width / 2, height / 2 - 20);

        const bgCard = this.add.rectangle(0, 0, 720, 300, 0x130d24, 0.92);
        bgCard.setStrokeStyle(1.8, 0xf59e0b);
        titleCard.add(bgCard);

        const titleText = this.add.text(0, -90, "PRANESH'S JOURNEY", {
            fontFamily: '"Chakra Petch", sans-serif',
            fontSize: '34px',
            fontStyle: 'bold',
            color: '#fef08a',
            stroke: '#78350f',
            strokeThickness: 3
        }).setOrigin(0.5);
        titleCard.add(titleText);

        const subtitleText = this.add.text(0, -48, "A SUNSET CYCLING TOUR THROUGH MY DISTRIBUTED SYSTEMS CAREER", {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#fb7185',
            letterSpacing: 1.5
        }).setOrigin(0.5);
        titleCard.add(subtitleText);

        const descText = this.add.text(0, 10,
            "Senior Software Engineer @ Amazon Lab126\n" +
            "Distributed Systems • VegaOS Greenfield OS Stack • 10K+ TPS • Bedrock Agentic AI\n\n" +
            "No stressful scores or timers. Just smooth cycling under a warm golden sunset.\n" +
            "Music: Procedural Sunset Rhodes Lo-Fi (70 BPM) with vinyl warmth", {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#cbd5e1',
            align: 'center',
            lineSpacing: 5
        }).setOrigin(0.5);
        titleCard.add(descText);

        // Start Button
        const startBtn = this.add.rectangle(0, 96, 290, 44, 0xd97706);
        startBtn.setStrokeStyle(1.5, 0xfde047);
        startBtn.setInteractive({ useHandCursor: true });

        const startText = this.add.text(0, 96, "BEGIN SUNSET RIDE [SPACE / CLICK]", {
            fontFamily: 'monospace',
            fontSize: '12px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        titleCard.add([startBtn, startText]);

        this.tweens.add({
            targets: [startBtn, startText],
            scaleX: 1.04,
            scaleY: 1.04,
            duration: 900,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        const launch = () => {
            window.soundEngine.ensureContext();
            window.soundEngine.startMusic();
            window.soundEngine.playStationChime();
            this.scene.start('GameScene');
        };

        startBtn.on('pointerdown', launch);
        this.input.on('pointerdown', launch);
        this.input.keyboard.on('keydown-SPACE', launch);
        this.input.keyboard.on('keydown-ENTER', launch);
    }
}

window.BootScene = BootScene;

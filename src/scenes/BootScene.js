/**
 * Boot Scene for Pranesh's Lo-Fi Cycling Journey
 */

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    create() {
        SpriteGenerator.generateAll(this);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Twilight Sky & Hills
        this.add.image(width / 2, height / 2, 'bg_lofi_sky').setDisplaySize(width, height);
        this.add.image(width / 2, height - 120, 'bg_lofi_hills').setDisplaySize(width, 240).setAlpha(0.7);

        // Title Card
        const titleCard = this.add.container(width / 2, height / 2 - 20);

        const bgCard = this.add.rectangle(0, 0, 720, 290, 0x09081e, 0.88);
        bgCard.setStrokeStyle(1.5, 0x0284c7);
        titleCard.add(bgCard);

        const titleText = this.add.text(0, -85, "PRANESH'S JOURNEY", {
            fontFamily: '"Chakra Petch", sans-serif',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#f8fafc',
            stroke: '#0284c7',
            strokeThickness: 2
        }).setOrigin(0.5);
        titleCard.add(titleText);

        const subtitleText = this.add.text(0, -45, "A CALM CYCLING TOUR THROUGH MY CAREER & ARCHITECTURE", {
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#ec4899',
            letterSpacing: 2
        }).setOrigin(0.5);
        titleCard.add(subtitleText);

        const descText = this.add.text(0, 10,
            "Senior Software Engineer @ Amazon Lab126\n" +
            "Distributed Systems • VegaOS Linux Validation • 10K+ TPS • Agentic AI on Bedrock\n\n" +
            "No stress, no scores. Just calm pedaling through 9+ years of engineering milestones.\n" +
            "Music: Procedural Warm Rhodes & Vinyl Lo-Fi (74 BPM)", {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#94a3b8',
            align: 'center',
            lineSpacing: 5
        }).setOrigin(0.5);
        titleCard.add(descText);

        // Start Button
        const startBtn = this.add.rectangle(0, 92, 280, 42, 0x0284c7);
        startBtn.setStrokeStyle(1.5, 0x38bdf8);
        startBtn.setInteractive({ useHandCursor: true });

        const startText = this.add.text(0, 92, "START CYCLING [SPACE / CLICK]", {
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

        // Launch function
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

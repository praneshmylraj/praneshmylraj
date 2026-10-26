/**
 * Boot & Title Scene
 */

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    create() {
        // Generate all procedural pixel textures and animations
        SpriteGenerator.generateAll(this);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Synthwave Starfield Background
        this.add.image(width / 2, height / 2, 'bg_stars_grid').setDisplaySize(width, height);

        // Title Box Card
        const titleCard = this.add.container(width / 2, height / 2 - 20);

        const bgCard = this.add.rectangle(0, 0, 680, 280, 0x050b14, 0.85);
        bgCard.setStrokeStyle(2, 0x00f0ff);
        titleCard.add(bgCard);

        const titleText = this.add.text(0, -75, "PRANESH'S WORLD RUNNER", {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#00f0ff',
            stroke: '#0891b2',
            strokeThickness: 2
        }).setOrigin(0.5);
        titleCard.add(titleText);

        const subtitleText = this.add.text(0, -35, "ODYSSEY THROUGH THE SOFTWARE STACK", {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#ec4899',
            letterSpacing: 2
        }).setOrigin(0.5);
        titleCard.add(subtitleText);

        const descText = this.add.text(0, 15, 
            "Kernel Internals • Blockchain Ledgers • Proprietary Vaults • Innovation Hub\n" +
            "Controls: [A][D] or [←][→] Move | [SPACE] Jump / Double Jump | [SHIFT]/[J] Cyber Dash", {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#94a3b8',
            align: 'center',
            lineSpacing: 6
        }).setOrigin(0.5);
        titleCard.add(descText);

        // Start Prompt Button
        const startBtn = this.add.rectangle(0, 80, 260, 44, 0x0284c7);
        startBtn.setStrokeStyle(2, 0x38bdf8);
        startBtn.setInteractive({ useHandCursor: true });

        const startText = this.add.text(0, 80, "START RUN [SPACE / CLICK]", {
            fontFamily: 'monospace',
            fontSize: '13px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        titleCard.add([startBtn, startText]);

        // Button pulsing effect
        this.tweens.add({
            targets: [startBtn, startText],
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 700,
            yoyo: true,
            repeat: -1
        });

        // Start function
        const launchGame = () => {
            window.soundEngine.ensureContext();
            window.soundEngine.startMusic();
            window.soundEngine.playJump();
            this.scene.start('GameScene');
        };

        startBtn.on('pointerdown', launchGame);
        this.input.on('pointerdown', launchGame);
        this.input.keyboard.on('keydown-SPACE', launchGame);
        this.input.keyboard.on('keydown-ENTER', launchGame);
    }
}

window.BootScene = BootScene;

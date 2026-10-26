/**
 * Victory Scene for Pranesh's World Runner
 */

class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    init(data) {
        this.score = data.score || 0;
        this.coins = data.coins || 0;
        this.secrets = data.secrets || 0;
        this.timeStr = data.timeStr || "01:30.0";
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background
        this.add.image(width / 2, height / 2, 'bg_stars_grid').setDisplaySize(width, height);

        // Calculate Rank
        let rank = "B-RANK CODER";
        let rankColor = "#38bdf8";
        if (this.secrets >= 5) {
            rank = "S-RANK FULL-STACK ARCHITECT";
            rankColor = "#f59e0b";
        } else if (this.secrets >= 3) {
            rank = "A-RANK KERNEL RUNNER";
            rankColor = "#10b981";
        }

        // Victory Box
        const card = this.add.container(width / 2, height / 2);

        const bg = this.add.rectangle(0, 0, 640, 360, 0x050b14, 0.92);
        bg.setStrokeStyle(2, 0x00f0ff);
        card.add(bg);

        const header = this.add.text(0, -135, "⚡ MISSION ACCOMPLISHED! ⚡", {
            fontFamily: 'monospace',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#00f0ff'
        }).setOrigin(0.5);
        card.add(header);

        const sub = this.add.text(0, -100, "You traversed Pranesh's software stack from Silicon to Uplink!", {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#ec4899'
        }).setOrigin(0.5);
        card.add(sub);

        // Stats grid
        const statsContent = [
            `FINAL TIME: ${this.timeStr}`,
            `TOTAL SCORE: ${this.score} PTS`,
            `COINS HARVESTED: ${this.coins}`,
            `SECRET DOSSIERS: ${this.secrets} / 5 UNLOCKED`,
            `ACHIEVEMENT RANK: ${rank}`
        ].join("\n\n");

        const statsText = this.add.text(0, -10, statsContent, {
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#e2e8f0',
            align: 'center',
            lineSpacing: 4
        }).setOrigin(0.5);
        card.add(statsText);

        // Buttons
        // 1. Replay Button
        const replayBtn = this.add.rectangle(-180, 120, 160, 40, 0x0284c7).setInteractive({ useHandCursor: true });
        replayBtn.setStrokeStyle(1, 0x38bdf8);
        const replayTxt = this.add.text(-180, 120, "↺ REPLAY", {
            fontFamily: 'monospace',
            fontSize: '13px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        card.add([replayBtn, replayTxt]);

        replayBtn.on('pointerdown', () => {
            window.soundEngine.playJump();
            this.scene.start('GameScene');
        });

        // 2. Contact Email Button
        const emailBtn = this.add.rectangle(0, 120, 170, 40, 0x059669).setInteractive({ useHandCursor: true });
        emailBtn.setStrokeStyle(1, 0x34d399);
        const emailTxt = this.add.text(0, 120, "✉ SEND EMAIL", {
            fontFamily: 'monospace',
            fontSize: '12px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        card.add([emailBtn, emailTxt]);

        emailBtn.on('pointerdown', () => {
            window.location.href = "mailto:inboxpranesh@gmail.com";
        });

        // 3. GitHub Button
        const ghBtn = this.add.rectangle(180, 120, 160, 40, 0x4f46e5).setInteractive({ useHandCursor: true });
        ghBtn.setStrokeStyle(1, 0x818cf8);
        const ghTxt = this.add.text(180, 120, "⚡ GITHUB PROFILE", {
            fontFamily: 'monospace',
            fontSize: '12px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        card.add([ghBtn, ghTxt]);

        ghBtn.on('pointerdown', () => {
            window.open("https://github.com/praneshmylraj", "_blank");
        });

        // Celebratory Fireworks Loop
        this.time.addEvent({
            delay: 400,
            repeat: -1,
            callback: () => {
                const rx = 100 + Math.random() * (width - 200);
                const ry = 80 + Math.random() * (height - 200);
                const colors = [0x00f0ff, 0xec4899, 0xfacc15, 0x22c55e, 0x8b5cf6];
                const tint = colors[Math.floor(Math.random() * colors.length)];

                for (let i = 0; i < 16; i++) {
                    const spark = this.add.sprite(rx, ry, 'particle_spark');
                    spark.setTint(tint);
                    const angle = (i / 16) * Math.PI * 2;
                    const speed = 40 + Math.random() * 60;
                    this.tweens.add({
                        targets: spark,
                        x: rx + Math.cos(angle) * speed,
                        y: ry + Math.sin(angle) * speed,
                        alpha: 0,
                        scale: 0.1,
                        duration: 500,
                        onComplete: () => spark.destroy()
                    });
                }
            }
        });
    }
}

window.VictoryScene = VictoryScene;

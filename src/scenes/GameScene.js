/**
 * Main Gameplay Scene for Pranesh's World Runner
 */

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.worldWidth = 10200;
        this.worldHeight = 600;

        // Reset game stats
        this.score = 0;
        this.coinsCollected = 0;
        this.secretsCollected = 0;
        this.totalSecrets = 5;
        this.startTime = Date.now();
        this.elapsedTimeStr = "00:00.0";
        this.currentCheckpoint = { x: 120, y: 400 };
        this.activeTerminal = null;
        this.dialogOpen = false;

        // Sound engine reference
        this.audio = window.soundEngine;

        // 1. Parallax Backgrounds
        this.bgSky = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'bg_stars_grid')
            .setOrigin(0, 0)
            .setScrollFactor(0);

        this.bgCity = this.add.tileSprite(0, 80, this.cameras.main.width, 384, 'bg_skyscrapers')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setAlpha(0.65);

        // 2. Physics Groups
        this.platforms = this.physics.add.staticGroup();
        this.hazards = this.physics.add.staticGroup();
        this.bouncePads = this.physics.add.group();
        this.collectibles = this.physics.add.group();
        this.secrets = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.movingPlatforms = [];
        this.terminals = [];
        this.checkpoints = [];

        // 3. World Construction
        WorldBuilder.build(this);

        // 4. Create Player
        this.player = new Player(this, this.currentCheckpoint.x, this.currentCheckpoint.y);

        // 5. Setup Collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);

        // Moving platforms collision
        this.movingPlatforms.forEach(mp => {
            this.physics.add.collider(this.player, mp);
        });

        // Player with Bounce Pads
        this.physics.add.overlap(this.player, this.bouncePads, (player, pad) => {
            if (player.body.velocity.y > -50) {
                player.body.setVelocityY(-720);
                this.audio.playBounce();
                this.spawnJumpParticles(pad.x, pad.y - 8);

                // Spring squash and stretch
                this.tweens.add({
                    targets: pad,
                    scaleY: 0.5,
                    duration: 80,
                    yoyo: true
                });
            }
        });

        // Player with Collectibles
        this.physics.add.overlap(this.player, this.collectibles, (player, item) => {
            if (item.isBattery) {
                player.dashEnergy = 100;
                this.score += 200;
                this.audio.playCollect('powerup');
                this.showFloatingText(item.x, item.y - 10, "+OVERCLOCK!", "#10b981");
            } else {
                this.coinsCollected++;
                this.score += 100;
                this.audio.playCollect(item.coinType);
                this.showFloatingText(item.x, item.y - 10, "+100", "#38bdf8");
            }
            this.spawnExplosionParticles(item.x, item.y, 0x00f0ff, 8);
            item.destroy();
        });

        // Player with Secrets
        this.physics.add.overlap(this.player, this.secrets, (player, secret) => {
            this.secretsCollected++;
            this.score += 500;
            this.audio.playSecret();
            this.spawnExplosionParticles(secret.x, secret.y, 0xf43f5e, 20);
            this.showFloatingText(secret.x, secret.y - 20, "★ SECRET DOSSIER FOUND! ★", "#ec4899");
            secret.destroy();
        });

        // Player with Hazards
        this.physics.add.overlap(this.player, this.hazards, (player, hazard) => {
            player.takeDamage(1);
        });

        // Player with Enemies
        this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
            // Stomp from above or dashing through
            if (player.isDashing || (player.body.velocity.y > 0 && player.y < enemy.y - 8)) {
                enemy.defeat();
                this.score += 250;
                this.showFloatingText(enemy.x, enemy.y - 10, "+250 GLITCH CLEARED!", "#ef4444");
                if (!player.isDashing) {
                    player.body.setVelocityY(-360);
                }
            } else {
                player.takeDamage(1);
            }
        });

        // Player with Finish Portal
        if (this.finishPortal) {
            this.physics.add.overlap(this.player, this.finishPortal, () => {
                this.triggerVictory();
            });
        }

        // 6. Camera Setup
        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
        this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight + 100);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setDeadzone(100, 60);

        // 7. Input Keys
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
            SHIFT: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            J: Phaser.Input.Keyboard.KeyCodes.J,
            X: Phaser.Input.Keyboard.KeyCodes.X,
            E: Phaser.Input.Keyboard.KeyCodes.E,
            R: Phaser.Input.Keyboard.KeyCodes.R,
            M: Phaser.Input.Keyboard.KeyCodes.M,
            ESC: Phaser.Input.Keyboard.KeyCodes.ESC
        });

        // Terminal interaction key
        this.input.keyboard.on('keydown-E', () => this.handleInteract());
        this.input.keyboard.on('keydown-R', () => this.respawnPlayer());
        this.input.keyboard.on('keydown-M', () => {
            const muted = this.audio.toggleMute();
            this.showFloatingText(this.player.x, this.player.y - 40, muted ? "AUDIO MUTED" : "AUDIO ON", "#f59e0b");
        });
        this.input.keyboard.on('keydown-ESC', () => this.closeDialog());

        // 8. In-Game Cyber HUD
        this.createHUD();
    }

    createHUD() {
        this.hudContainer = this.add.container(0, 0).setScrollFactor(0);

        // Top HUD bar background
        const topBar = this.add.rectangle(this.cameras.main.width / 2, 22, this.cameras.main.width - 20, 36, 0x050b14, 0.85);
        topBar.setStrokeStyle(1, 0x1e293b);
        this.hudContainer.add(topBar);

        // Health Display
        this.healthText = this.add.text(24, 14, "HEALTH: ❤️ ❤️ ❤️", {
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#ef4444',
            fontStyle: 'bold'
        });
        this.hudContainer.add(this.healthText);

        // Dash Meter Bar
        this.dashLabel = this.add.text(190, 14, "DASH:", {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#00f0ff'
        });
        this.dashBg = this.add.rectangle(270, 22, 60, 10, 0x1e293b);
        this.dashFill = this.add.rectangle(270, 22, 60, 10, 0x00f0ff);
        this.hudContainer.add([this.dashLabel, this.dashBg, this.dashFill]);

        // Zone Indicator Badge
        this.zoneBadge = this.add.text(this.cameras.main.width / 2, 22, "ZONE 1: KERNEL DEPTHS", {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#38bdf8',
            backgroundColor: '#0c4a6e',
            padding: { x: 8, y: 3 }
        }).setOrigin(0.5);
        this.hudContainer.add(this.zoneBadge);

        // Coins and Secrets Counter
        this.statsText = this.add.text(this.cameras.main.width - 260, 14, "🪙 0  |  📁 0/5", {
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#fbbf24',
            fontStyle: 'bold'
        });
        this.hudContainer.add(this.statsText);

        // Speedrun Timer
        this.timerText = this.add.text(this.cameras.main.width - 110, 14, "⏱ 00:00.0", {
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#a855f7',
            fontStyle: 'bold'
        });
        this.hudContainer.add(this.timerText);

        // Bottom World Progress Bar
        const botBarBg = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height - 12, this.cameras.main.width - 40, 6, 0x1e293b, 0.9);
        this.progressBar = this.add.rectangle(20, this.cameras.main.height - 12, 0, 6, 0x00f0ff);
        this.progressBar.setOrigin(0, 0.5);
        this.hudContainer.add([botBarBg, this.progressBar]);

        // Dialogue Modal Container
        this.createDialogModal();
    }

    createDialogModal() {
        this.dialogContainer = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2).setScrollFactor(0);
        this.dialogContainer.setVisible(false);

        const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.6);
        overlay.setInteractive();

        const box = this.add.rectangle(0, 0, 560, 240, 0x090d16, 0.96);
        box.setStrokeStyle(2, 0x00f0ff);

        this.dialogTitle = this.add.text(-250, -95, "TERMINAL ACCESS", {
            fontFamily: 'monospace',
            fontSize: '15px',
            fontStyle: 'bold',
            color: '#00f0ff'
        });

        this.dialogTag = this.add.text(250, -95, "[SECURE]", {
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#38bdf8'
        }).setOrigin(1, 0);

        const divider = this.add.line(0, -75, -250, 0, 250, 0, 0x1e293b);

        this.dialogBody = this.add.text(-250, -60, "", {
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#e2e8f0',
            lineSpacing: 6,
            wordWrap: { width: 500 }
        });

        const closeHint = this.add.text(0, 92, "Press [E] or [ESC] or Click to Close", {
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#64748b'
        }).setOrigin(0.5);

        overlay.on('pointerdown', () => this.closeDialog());
        box.setInteractive();
        box.on('pointerdown', () => this.closeDialog());

        this.dialogContainer.add([overlay, box, this.dialogTitle, this.dialogTag, divider, this.dialogBody, closeHint]);
    }

    update(time, delta) {
        // Parallax background follow
        this.bgSky.tilePositionX = this.cameras.main.scrollX * 0.15;
        this.bgCity.tilePositionX = this.cameras.main.scrollX * 0.45;

        // Player update if dialog not blocking
        if (!this.dialogOpen) {
            this.player.update(time, delta, this.cursors, this.keys);
        }

        // Enemies update
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.update) enemy.update();
        });

        // Check if player fell into pit
        if (this.player.y > 580 && !this.player.isDead) {
            this.player.takeDamage(1);
            if (!this.player.isDead) {
                this.respawnPlayer();
            }
        }

        // Checkpoints proximity
        this.checkpoints.forEach(cp => {
            if (Math.abs(this.player.x - cp.x) < 32 && Math.abs(this.player.y - cp.y) < 60) {
                if (!cp.isActivated) {
                    cp.activate();
                    this.currentCheckpoint = { x: cp.x, y: cp.y };
                    this.showFloatingText(cp.x, cp.y - 40, "CHECKPOINT SAVED!", "#00f0ff");
                }
            }
        });

        // Terminals proximity check
        let nearestTerminal = null;
        let minDist = 70;
        this.terminals.forEach(t => {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, t.x, t.y);
            if (dist < minDist) {
                nearestTerminal = t;
            }
        });

        if (nearestTerminal !== this.activeTerminal) {
            if (this.activeTerminal) this.activeTerminal.setInRange(false);
            this.activeTerminal = nearestTerminal;
            if (this.activeTerminal) this.activeTerminal.setInRange(true);
        }

        // Update HUD
        this.updateHUD();
    }

    updateHUD() {
        // Health pips
        const hearts = "❤️ ".repeat(Math.max(0, this.player.health));
        this.healthText.setText(`HEALTH: ${hearts}`);

        // Dash bar width
        const ratio = this.player.dashEnergy / 100;
        this.dashFill.width = 60 * ratio;

        // Zone tracking based on player X position
        const px = this.player.x;
        if (px < 2500) {
            this.zoneBadge.setText("ZONE 1: KERNEL & SILICON DEPTHS");
            this.zoneBadge.setBackgroundColor('#0c4a6e');
        } else if (px < 5200) {
            this.zoneBadge.setText("ZONE 2: BLOCKCHAIN CONSENSUS");
            this.zoneBadge.setBackgroundColor('#581c87');
        } else if (px < 7600) {
            this.zoneBadge.setText("ZONE 3: CLASSIFIED PROPRIETARY VAULT");
            this.zoneBadge.setBackgroundColor('#881337');
        } else {
            this.zoneBadge.setText("ZONE 4: INNOVATION SUMMIT & UPLINK");
            this.zoneBadge.setBackgroundColor('#134e4a');
        }

        // Coins & Secrets
        this.statsText.setText(`🪙 ${this.coinsCollected}  |  📁 ${this.secretsCollected}/${this.totalSecrets}`);

        // Speedrun Timer
        const elapsed = Date.now() - this.startTime;
        const mins = Math.floor(elapsed / 60000);
        const secs = Math.floor((elapsed % 60000) / 1000);
        const ms = Math.floor((elapsed % 1000) / 100);
        this.elapsedTimeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${ms}`;
        this.timerText.setText(`⏱ ${this.elapsedTimeStr}`);

        // Bottom Progress Bar
        const progress = Math.min(1, Math.max(0, px / (this.worldWidth - 400)));
        this.progressBar.width = (this.cameras.main.width - 40) * progress;
    }

    handleInteract() {
        if (this.dialogOpen) {
            this.closeDialog();
            return;
        }

        if (this.activeTerminal) {
            this.openDialog(this.activeTerminal.loreData);
        }
    }

    openDialog(lore) {
        this.dialogOpen = true;
        this.player.body.setVelocity(0, 0);
        this.audio.playTerminalBeep();

        this.dialogTitle.setText(lore.title);
        this.dialogTag.setText(`[${lore.tag}]`);
        this.dialogBody.setText(lore.content);
        this.dialogContainer.setVisible(true);

        // Sound effects
        this.audio.playTerminalBeep();
    }

    closeDialog() {
        if (this.dialogOpen) {
            this.dialogOpen = false;
            this.dialogContainer.setVisible(false);
            this.audio.playTerminalBeep();
        }
    }

    respawnPlayer() {
        this.player.respawn(this.currentCheckpoint.x, this.currentCheckpoint.y);
        this.cameras.main.flash(400, 0, 240, 255);
    }

    triggerVictory() {
        this.audio.playVictory();
        this.scene.start('VictoryScene', {
            score: this.score,
            coins: this.coinsCollected,
            secrets: this.secretsCollected,
            timeStr: this.elapsedTimeStr
        });
    }

    // Particle FX helpers
    spawnJumpParticles(x, y) {
        for (let i = 0; i < 6; i++) {
            const p = this.add.sprite(x, y, 'particle_spark');
            p.setTint(0x00f0ff);
            this.tweens.add({
                targets: p,
                x: x + (Math.random() - 0.5) * 30,
                y: y + Math.random() * 20,
                alpha: 0,
                scale: 0.2,
                duration: 250,
                onComplete: () => p.destroy()
            });
        }
    }

    spawnDoubleJumpRing(x, y) {
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
            const p = this.add.sprite(x, y, 'particle_dash');
            p.setTint(0xd946ef);
            this.tweens.add({
                targets: p,
                x: x + Math.cos(a) * 35,
                y: y + Math.sin(a) * 20,
                alpha: 0,
                scale: 0.1,
                duration: 300,
                onComplete: () => p.destroy()
            });
        }
    }

    spawnExplosionParticles(x, y, tint = 0x00f0ff, count = 12) {
        for (let i = 0; i < count; i++) {
            const p = this.add.sprite(x, y, 'particle_spark');
            p.setTint(tint);
            const angle = Math.random() * Math.PI * 2;
            const dist = 25 + Math.random() * 45;
            this.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist,
                alpha: 0,
                scale: 0.1,
                duration: 350 + Math.random() * 150,
                onComplete: () => p.destroy()
            });
        }
    }

    spawnDeathParticles(x, y) {
        this.spawnExplosionParticles(x, y, 0xef4444, 25);
        this.spawnExplosionParticles(x, y, 0x00f0ff, 25);
    }

    showFloatingText(x, y, message, color = '#ffffff') {
        const txt = this.add.text(x, y, message, {
            fontFamily: 'monospace',
            fontSize: '11px',
            fontStyle: 'bold',
            color: color,
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: txt,
            y: y - 35,
            alpha: 0,
            duration: 900,
            onComplete: () => txt.destroy()
        });
    }
}

window.GameScene = GameScene;

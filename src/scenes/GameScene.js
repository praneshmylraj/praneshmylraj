/**
 * Main Sunset Lo-Fi Cycling Scene
 */

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.worldWidth = 14000;
        this.worldHeight = 540;

        this.activeStation = null;

        // 1. Parallax Sunset Backgrounds
        this.bgSky = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'bg_sunset_sky')
            .setOrigin(0, 0)
            .setScrollFactor(0);

        this.bgHills = this.add.tileSprite(0, 160, this.cameras.main.width, 260, 'bg_village_hills')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setAlpha(0.85);

        // 2. Physics Platforms & Stations
        this.platforms = this.physics.add.staticGroup();
        this.stations = [];

        WorldBuilder.build(this);

        // 3. Create Cyclist (Pranesh)
        this.cyclist = new Cyclist(this, 250, 428);
        this.physics.add.collider(this.cyclist, this.platforms);

        // 4. Camera Follow
        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
        this.cameras.main.startFollow(this.cyclist, true, 0.06, 0.06);
        this.cameras.main.setDeadzone(90, 40);

        // 5. Input Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
            ENTER: Phaser.Input.Keyboard.KeyCodes.ENTER,
            E: Phaser.Input.Keyboard.KeyCodes.E,
            C: Phaser.Input.Keyboard.KeyCodes.C,
            M: Phaser.Input.Keyboard.KeyCodes.M,
            ESC: Phaser.Input.Keyboard.KeyCodes.ESC
        });

        // Key shortcuts
        this.input.keyboard.on('keydown-C', () => this.toggleCruise());
        this.input.keyboard.on('keydown-M', () => window.soundEngine.toggleMute());
        this.input.keyboard.on('keydown-ESC', () => {
            if (window.closeResumeModal) window.closeResumeModal();
        });
        this.input.keyboard.on('keydown-SPACE', () => {
            if (window.isModalOpen) {
                if (window.closeResumeModal) window.closeResumeModal();
            } else if (this.activeStation) {
                if (window.openResumeModal) window.openResumeModal(this.activeStation.milestone);
            }
        });
        this.input.keyboard.on('keydown-E', () => {
            if (this.activeStation && window.openResumeModal) {
                window.openResumeModal(this.activeStation.milestone);
            }
        });

        // 6. In-Game Minimalist HUD
        this.createHUD();

        // Dispatch milestones to HTML station bar
        if (window.renderStationBar) {
            window.renderStationBar(window.RESUME_DATA.milestones);
        }
    }

    createHUD() {
        this.hud = this.add.container(0, 0).setScrollFactor(0);

        // Top Status Bar (Warm Glass)
        const topBar = this.add.rectangle(this.cameras.main.width / 2, 22, this.cameras.main.width - 24, 34, 0x130d24, 0.88);
        topBar.setStrokeStyle(1.5, 0x78350f);
        this.hud.add(topBar);

        // Auto Cruise Toggle Button
        this.cruiseBtn = this.add.container(85, 22);
        const cBg = this.add.rectangle(0, 0, 140, 24, 0x291538, 0.95).setInteractive({ useHandCursor: true });
        cBg.setStrokeStyle(1, 0xf59e0b);
        this.cruiseText = this.add.text(0, 0, "🚴 AUTO-CRUISE: ON", {
            fontFamily: 'monospace',
            fontSize: '10.5px',
            fontStyle: 'bold',
            color: '#fde047'
        }).setOrigin(0.5);
        this.cruiseBtn.add([cBg, this.cruiseText]);
        cBg.on('pointerdown', () => this.toggleCruise());
        this.hud.add(this.cruiseBtn);

        // Center Station Indicator
        this.stationIndicator = this.add.text(this.cameras.main.width / 2, 22, "SUNSET RIDE: OVERVIEW & CONTACT", {
            fontFamily: '"Chakra Petch", sans-serif',
            fontSize: '12px',
            fontStyle: 'bold',
            color: '#fef08a'
        }).setOrigin(0.5);
        this.hud.add(this.stationIndicator);

        // Right Tips
        const tipText = this.add.text(this.cameras.main.width - 25, 22, "🌅 SUNSET LO-FI 70 BPM  •  [C] CRUISE  •  [SPACE] READ", {
            fontFamily: 'monospace',
            fontSize: '10px',
            color: '#fb7185'
        }).setOrigin(1, 0.5);
        this.hud.add(tipText);

        // Bottom Scenic Card Preview
        this.previewCard = this.add.container(this.cameras.main.width / 2, this.cameras.main.height - 48);
        this.previewCard.setVisible(false);

        const cardBg = this.add.rectangle(0, 0, 720, 50, 0x130d24, 0.94);
        cardBg.setStrokeStyle(1.8, 0xf59e0b);
        cardBg.setInteractive({ useHandCursor: true });
        cardBg.on('pointerdown', () => {
            if (this.activeStation && window.openResumeModal) {
                window.openResumeModal(this.activeStation.milestone);
            }
        });

        this.previewTitle = this.add.text(-340, -11, "", {
            fontFamily: '"Chakra Petch", sans-serif',
            fontSize: '13px',
            fontStyle: 'bold',
            color: '#fde047'
        });

        this.previewSubtitle = this.add.text(-340, 8, "", {
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#fed7aa'
        });

        const openBtn = this.add.rectangle(300, 0, 105, 28, 0xd97706);
        openBtn.setStrokeStyle(1.2, 0xfde047);
        const openTxt = this.add.text(300, 0, "READ STORY ➔", {
            fontFamily: 'monospace',
            fontSize: '10px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.previewCard.add([cardBg, this.previewTitle, this.previewSubtitle, openBtn, openTxt]);
        this.hud.add(this.previewCard);
    }

    update(time, delta) {
        // Parallax background scrolling
        this.bgSky.tilePositionX = this.cameras.main.scrollX * 0.06;
        this.bgHills.tilePositionX = this.cameras.main.scrollX * 0.25;

        // Cyclist update
        if (!window.isModalOpen) {
            this.cyclist.update(delta, this.cursors, this.keys);
        } else {
            this.cyclist.body.setVelocityX(0);
        }

        // Proximity to stations
        let nearest = null;
        let minDist = 180;

        this.stations.forEach(st => {
            const dist = Math.abs(this.cyclist.x - st.x);
            if (dist < minDist) {
                nearest = st;
            }
        });

        if (nearest !== this.activeStation) {
            if (this.activeStation) this.activeStation.setInRange(false);
            this.activeStation = nearest;
            if (this.activeStation) {
                this.activeStation.setInRange(true);
                this.showStationPreview(this.activeStation.milestone);
            } else {
                this.hideStationPreview();
            }
        }
    }

    toggleCruise() {
        const isCruising = this.cyclist.toggleCruise();
        this.cruiseText.setText(isCruising ? "🚴 AUTO-CRUISE: ON" : "🚴 MANUAL: OFF");
        this.cruiseText.setColor(isCruising ? "#fde047" : "#94a3b8");
        window.soundEngine.playClick();
    }

    showStationPreview(milestone) {
        this.stationIndicator.setText(`STATION: ${milestone.badge} // ${milestone.title}`);
        this.previewTitle.setText(milestone.title);
        this.previewSubtitle.setText(`${milestone.subtitle} • ${milestone.quote}`);
        this.previewCard.setVisible(true);

        if (window.highlightStationPill) {
            window.highlightStationPill(milestone.id);
        }
    }

    hideStationPreview() {
        this.previewCard.setVisible(false);
    }

    jumpToMilestone(milestoneId) {
        const list = window.RESUME_DATA.milestones;
        const idx = list.findIndex(m => m.id === milestoneId);
        if (idx !== -1 && this.stations[idx]) {
            const st = this.stations[idx];
            this.cyclist.x = st.x - 30;
            if (window.openResumeModal) {
                window.openResumeModal(list[idx]);
            }
        }
    }
}

window.GameScene = GameScene;

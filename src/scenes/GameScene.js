/**
 * Main Lo-Fi Cycling Scene through Pranesh's Career
 */

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.worldWidth = 12000;
        this.worldHeight = 540;

        // State
        this.activeStation = null;
        this.modalOpen = false;

        // 1. Parallax Scenic Backgrounds
        this.bgSky = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'bg_lofi_sky')
            .setOrigin(0, 0)
            .setScrollFactor(0);

        this.bgHills = this.add.tileSprite(0, 180, this.cameras.main.width, 240, 'bg_lofi_hills')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setAlpha(0.75);

        // 2. Physics Platforms & Stations
        this.platforms = this.physics.add.staticGroup();
        this.stations = [];

        WorldBuilder.build(this);

        // 3. Create Cyclist (Pranesh)
        this.cyclist = new Cyclist(this, 200, 435);
        this.physics.add.collider(this.cyclist, this.platforms);

        // 4. Camera Follow
        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
        this.cameras.main.startFollow(this.cyclist, true, 0.06, 0.06);
        this.cameras.main.setDeadzone(80, 40);

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

        // Toggle Auto-Cruise key
        this.input.keyboard.on('keydown-C', () => this.toggleCruise());
        this.input.keyboard.on('keydown-M', () => window.soundEngine.toggleMute());
        this.input.keyboard.on('keydown-ESC', () => this.closeMilestoneModal());
        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.modalOpen) {
                this.closeMilestoneModal();
            } else if (this.activeStation) {
                this.openMilestoneModal(this.activeStation.milestone);
            }
        });
        this.input.keyboard.on('keydown-E', () => {
            if (this.activeStation) this.openMilestoneModal(this.activeStation.milestone);
        });

        // 6. HUD and UI Overlay
        this.createHUD();
        this.createReaderModal();

        // Dispatch initial station list to HTML navigation
        if (window.renderStationBar) {
            window.renderStationBar(window.RESUME_DATA.milestones);
        }
    }

    createHUD() {
        this.hud = this.add.container(0, 0).setScrollFactor(0);

        // Top Status Bar (Translucent glass)
        const topBar = this.add.rectangle(this.cameras.main.width / 2, 22, this.cameras.main.width - 24, 34, 0x09081e, 0.85);
        topBar.setStrokeStyle(1, 0x1e293b);
        this.hud.add(topBar);

        // Auto Cruise Indicator Button
        this.cruiseBtn = this.add.container(80, 22);
        const cBg = this.add.rectangle(0, 0, 130, 22, 0x0f172a, 0.9).setInteractive({ useHandCursor: true });
        cBg.setStrokeStyle(1, 0x0284c7);
        this.cruiseText = this.add.text(0, 0, "🚴 AUTO-CRUISE: ON", {
            fontFamily: 'monospace',
            fontSize: '10px',
            fontStyle: 'bold',
            color: '#38bdf8'
        }).setOrigin(0.5);
        this.cruiseBtn.add([cBg, this.cruiseText]);
        cBg.on('pointerdown', () => this.toggleCruise());
        this.hud.add(this.cruiseBtn);

        // Station Header Indicator
        this.stationIndicator = this.add.text(this.cameras.main.width / 2, 22, "CYCLING THROUGH: OVERVIEW & CONTACT", {
            fontFamily: '"Chakra Petch", sans-serif',
            fontSize: '12px',
            fontStyle: 'bold',
            color: '#f8fafc'
        }).setOrigin(0.5);
        this.hud.add(this.stationIndicator);

        // Audio & Guide label
        const tipText = this.add.text(this.cameras.main.width - 30, 22, "🎵 LO-FI 74 BPM  •  [C] CRUISE  •  [SPACE] READ", {
            fontFamily: 'monospace',
            fontSize: '10px',
            color: '#94a3b8'
        }).setOrigin(1, 0.5);
        this.hud.add(tipText);

        // Bottom Scenic Card Preview (shows up when passing milestone)
        this.previewCard = this.add.container(this.cameras.main.width / 2, this.cameras.main.height - 48);
        this.previewCard.setVisible(false);

        const cardBg = this.add.rectangle(0, 0, 700, 48, 0x09081e, 0.92);
        cardBg.setStrokeStyle(1.5, 0x38bdf8);
        cardBg.setInteractive({ useHandCursor: true });
        cardBg.on('pointerdown', () => {
            if (this.activeStation) this.openMilestoneModal(this.activeStation.milestone);
        });

        this.previewTitle = this.add.text(-330, -10, "", {
            fontFamily: '"Chakra Petch", sans-serif',
            fontSize: '13px',
            fontStyle: 'bold',
            color: '#00f0ff'
        });

        this.previewSubtitle = this.add.text(-330, 8, "", {
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#cbd5e1'
        });

        const openBtn = this.add.rectangle(290, 0, 95, 26, 0x0284c7);
        openBtn.setStrokeStyle(1, 0x38bdf8);
        const openTxt = this.add.text(290, 0, "READ STORY ➔", {
            fontFamily: 'monospace',
            fontSize: '10px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.previewCard.add([cardBg, this.previewTitle, this.previewSubtitle, openBtn, openTxt]);
        this.hud.add(this.previewCard);
    }

    createReaderModal() {
        this.modalContainer = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2).setScrollFactor(0);
        this.modalContainer.setVisible(false);

        const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.7);
        overlay.setInteractive();
        overlay.on('pointerdown', () => this.closeMilestoneModal());

        const box = this.add.rectangle(0, 0, 780, 440, 0x09081e, 0.98);
        box.setStrokeStyle(2, 0x0284c7);
        box.setInteractive(); // Prevent click through

        this.mBadge = this.add.text(-360, -195, "", {
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#38bdf8',
            backgroundColor: '#0c4a6e',
            padding: { x: 6, y: 2 }
        });

        this.mTitle = this.add.text(-360, -165, "", {
            fontFamily: '"Chakra Petch", sans-serif',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#ffffff'
        });

        this.mPeriod = this.add.text(-360, -135, "", {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#ec4899'
        });

        this.mQuote = this.add.text(-360, -112, "", {
            fontFamily: 'monospace',
            fontSize: '12px',
            fontStyle: 'italic',
            color: '#cbd5e1',
            wordWrap: { width: 720 }
        });

        // Content Area Text
        this.mHighlights = this.add.text(-360, -75, "", {
            fontFamily: 'monospace',
            fontSize: '11.5px',
            color: '#e2e8f0',
            lineSpacing: 7,
            wordWrap: { width: 720 }
        });

        // Tags Footer
        this.mTags = this.add.text(-360, 150, "", {
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#38bdf8'
        });

        // Close Button
        const closeBtn = this.add.rectangle(340, -195, 26, 26, 0x1e293b).setInteractive({ useHandCursor: true });
        closeBtn.setStrokeStyle(1, 0x64748b);
        const closeTxt = this.add.text(340, -195, "✕", {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);

        closeBtn.on('pointerdown', () => this.closeMilestoneModal());

        // Previous & Next Navigation Buttons
        const prevBtn = this.add.rectangle(-80, 185, 120, 28, 0x1e293b).setInteractive({ useHandCursor: true });
        prevBtn.setStrokeStyle(1, 0x334155);
        const prevTxt = this.add.text(-80, 185, "◀ PREVIOUS", {
            fontFamily: 'monospace',
            fontSize: '10px',
            color: '#cbd5e1'
        }).setOrigin(0.5);
        prevBtn.on('pointerdown', () => this.navigateMilestone(-1));

        const nextBtn = this.add.rectangle(80, 185, 120, 28, 0x0284c7).setInteractive({ useHandCursor: true });
        nextBtn.setStrokeStyle(1, 0x38bdf8);
        const nextTxt = this.add.text(80, 185, "NEXT ➔", {
            fontFamily: 'monospace',
            fontSize: '10px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);
        nextBtn.on('pointerdown', () => this.navigateMilestone(1));

        this.modalContainer.add([
            overlay, box,
            this.mBadge, this.mTitle, this.mPeriod, this.mQuote,
            this.mHighlights, this.mTags,
            closeBtn, closeTxt,
            prevBtn, prevTxt, nextBtn, nextTxt
        ]);
    }

    update(time, delta) {
        // Parallax background scrolling
        this.bgSky.tilePositionX = this.cameras.main.scrollX * 0.08;
        this.bgHills.tilePositionX = this.cameras.main.scrollX * 0.25;

        // Update cyclist physics & movement
        if (!this.modalOpen) {
            this.cyclist.update(delta, this.cursors, this.keys);
        } else {
            this.cyclist.body.setVelocityX(0);
        }

        // Check proximity to stations
        let nearest = null;
        let minDist = 160;

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
        this.cruiseText.setColor(isCruising ? "#38bdf8" : "#94a3b8");
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

    openMilestoneModal(milestone) {
        this.currentModalMilestone = milestone;
        this.modalOpen = true;
        window.soundEngine.playStationChime();

        this.mBadge.setText(`[${milestone.badge}]`);
        this.mTitle.setText(milestone.title);
        this.mPeriod.setText(`${milestone.subtitle}  |  ${milestone.period}`);
        this.mQuote.setText(`“${milestone.quote}”`);

        // Format highlights with clean bullets
        const lines = milestone.highlights.map(h => `• ${h}`).join("\n\n");
        this.mHighlights.setText(lines);

        // Tags
        const tags = milestone.techTags.map(t => `#${t}`).join("   ");
        this.mTags.setText(`Tech: ${tags}`);

        this.modalContainer.setVisible(true);
    }

    closeMilestoneModal() {
        if (this.modalOpen) {
            this.modalOpen = false;
            this.modalContainer.setVisible(false);
            window.soundEngine.playClick();
        }
    }

    navigateMilestone(direction) {
        if (!this.currentModalMilestone) return;
        const list = window.RESUME_DATA.milestones;
        const curIdx = list.findIndex(m => m.id === this.currentModalMilestone.id);
        let nextIdx = curIdx + direction;
        if (nextIdx < 0) nextIdx = list.length - 1;
        if (nextIdx >= list.length) nextIdx = 0;

        const nextMilestone = list[nextIdx];
        this.openMilestoneModal(nextMilestone);

        // Jump cyclist to that station position smoothly
        const st = this.stations[nextIdx];
        if (st) {
            this.cyclist.x = st.x - 30;
        }
    }

    jumpToMilestone(milestoneId) {
        const list = window.RESUME_DATA.milestones;
        const idx = list.findIndex(m => m.id === milestoneId);
        if (idx !== -1 && this.stations[idx]) {
            const st = this.stations[idx];
            this.cyclist.x = st.x - 20;
            this.openMilestoneModal(list[idx]);
        }
    }
}

window.GameScene = GameScene;

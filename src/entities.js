/**
 * Entities for Sunset Cycling Journey
 * Seamless, bug-free cyclist physics and cozy roadside pavilions.
 */

class Cyclist extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'cyclist_pedal_0');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(false);
        this.setSize(60, 44);
        this.setOffset(10, 10);

        // Movement parameters
        this.CRUISE_SPEED = 115;
        this.MAX_SPEED = 230;
        this.ACCEL = 380;
        this.DECEL = 300;

        this.speed = this.CRUISE_SPEED;
        this.isCruising = true;
        this.targetSpeed = this.CRUISE_SPEED;

        this.play('anim_cyclist_pedal');
    }

    update(delta, cursors, keys) {
        const rightDown = Boolean(cursors?.right?.isDown || keys?.D?.isDown || window.virtualInput?.right);
        const leftDown = Boolean(cursors?.left?.isDown || keys?.A?.isDown || window.virtualInput?.left);

        if (rightDown) {
            this.isCruising = false;
            this.targetSpeed = this.MAX_SPEED;
        } else if (leftDown) {
            this.isCruising = false;
            this.targetSpeed = 0; // Gentle brake
        } else if (this.isCruising) {
            this.targetSpeed = this.CRUISE_SPEED;
        } else {
            this.targetSpeed = this.CRUISE_SPEED;
        }

        // Smooth speed interpolation
        const dt = delta / 1000;
        if (this.speed < this.targetSpeed) {
            this.speed = Math.min(this.targetSpeed, this.speed + this.ACCEL * dt);
        } else if (this.speed > this.targetSpeed) {
            this.speed = Math.max(this.targetSpeed, this.speed - this.DECEL * dt);
        }

        // Apply velocity
        this.body.setVelocityX(this.speed);

        // Adjust animation cadence
        if (this.speed > 8) {
            if (!this.anims.isPlaying) this.play('anim_cyclist_pedal');
            const rate = Math.max(3, (this.speed / this.CRUISE_SPEED) * 10);
            this.anims.timeScale = rate / 10;
        } else {
            if (this.anims.isPlaying) this.stop();
            this.setTexture('cyclist_pedal_0');
        }

        // Seamless Infinite Loop (cycling around the warm globe)
        const loopBoundary = this.scene.worldWidth - 500;
        if (this.x > loopBoundary) {
            this.x = 250;
            this.scene.cameras.main.scrollX = 0;
        } else if (this.x < 150) {
            this.x = 150;
        }
    }

    toggleCruise() {
        this.isCruising = !this.isCruising;
        if (this.isCruising) {
            this.targetSpeed = this.CRUISE_SPEED;
        }
        return this.isCruising;
    }
}

// ----------------------------------------------------
// Milestone Pavilion along the sunset road
// ----------------------------------------------------
class MilestonePavilion extends Phaser.GameObjects.Container {
    constructor(scene, x, y, milestoneData) {
        super(scene, x, y);
        scene.add.existing(this);
        this.milestone = milestoneData;
        this.hasVisited = false;

        // Pavilion Structure Graphic
        this.pavilionSprite = scene.add.sprite(0, -65, 'station_pavilion');
        this.add(this.pavilionSprite);

        // Station Header Badge
        const badgeBg = scene.add.rectangle(0, -145, 210, 26, 0x130d24, 0.92);
        badgeBg.setStrokeStyle(1.5, 0xf59e0b);
        this.add(badgeBg);

        const badgeText = scene.add.text(0, -145, milestoneData.badge, {
            fontFamily: 'monospace',
            fontSize: '11px',
            fontStyle: 'bold',
            color: '#fef08a'
        }).setOrigin(0.5);
        this.add(badgeText);

        // Station Title
        const titleText = scene.add.text(0, -120, milestoneData.title.split('—')[0].trim(), {
            fontFamily: '"Chakra Petch", sans-serif',
            fontSize: '13px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#130d24',
            strokeThickness: 3
        }).setOrigin(0.5);
        this.add(titleText);

        // Floating Prompt Icon
        this.promptText = scene.add.text(0, -92, "✨ [CLICK OR SPACE TO READ] ✨", {
            fontFamily: 'monospace',
            fontSize: '10.5px',
            color: '#fde047',
            backgroundColor: '#1c0d28',
            padding: { x: 7, y: 3 }
        }).setOrigin(0.5);
        this.promptText.setVisible(false);
        this.add(this.promptText);

        // Floating hover tween for prompt
        scene.tweens.add({
            targets: this.promptText,
            y: -96,
            duration: 900,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Click to open story
        badgeBg.setInteractive({ useHandCursor: true });
        badgeBg.on('pointerdown', () => {
            if (window.openResumeModal) window.openResumeModal(this.milestone);
        });
        this.pavilionSprite.setInteractive({ useHandCursor: true });
        this.pavilionSprite.on('pointerdown', () => {
            if (window.openResumeModal) window.openResumeModal(this.milestone);
        });
    }

    setInRange(inRange) {
        this.promptText.setVisible(inRange);
        if (inRange && !this.hasVisited) {
            this.hasVisited = true;
            window.soundEngine.playStationChime();
        }
    }
}

window.Cyclist = Cyclist;
window.MilestonePavilion = MilestonePavilion;

/**
 * Cyclist and Milestone Pavilion Entities
 * Designed for peaceful, calm cycling through Pranesh's career story.
 */

class Cyclist extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'cyclist_pedal_0');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(false);
        this.setSize(48, 36);
        this.setOffset(8, 8);

        // Movement configuration
        this.CRUISE_SPEED = 120;
        this.MAX_SPEED = 240;
        this.ACCEL = 400;
        this.DECEL = 350;

        // Current speed & cruising state
        this.speed = this.CRUISE_SPEED;
        this.isCruising = true; // Auto-cruise on by default for effortless relaxation
        this.targetSpeed = this.CRUISE_SPEED;

        this.play('anim_cyclist_pedal');
    }

    update(delta, cursors, keys) {
        // Controls
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
            // Coast at comfortable pace
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

        // Adjust animation speed based on cycling velocity
        if (this.speed > 10) {
            if (!this.anims.isPlaying) this.play('anim_cyclist_pedal');
            const rate = Math.max(3, (this.speed / this.CRUISE_SPEED) * 10);
            this.anims.timeScale = rate / 10;
        } else {
            if (this.anims.isPlaying) this.stop();
            this.setTexture('cyclist_pedal_0');
        }

        // Infinite World Looping (Continuous calm cycling like a sphere!)
        const worldWidth = this.scene.worldWidth || 12000;
        if (this.x > worldWidth - 400) {
            this.x = 200;
            this.scene.cameras.main.scrollX = 0;
        } else if (this.x < 100) {
            this.x = 100;
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
// Milestone Pavilion along the scenic route
// ----------------------------------------------------
class MilestonePavilion extends Phaser.GameObjects.Container {
    constructor(scene, x, y, milestoneData) {
        super(scene, x, y);
        scene.add.existing(this);
        this.milestone = milestoneData;
        this.hasVisited = false;

        // Pavilion Graphic
        this.pavilionSprite = scene.add.sprite(0, -60, 'station_pavilion');
        this.add(this.pavilionSprite);

        // Station Signboard Header
        const badgeBg = scene.add.rectangle(0, -135, 200, 24, 0x090d16, 0.9);
        badgeBg.setStrokeStyle(1, 0x0284c7);
        this.add(badgeBg);

        const badgeText = scene.add.text(0, -135, milestoneData.badge, {
            fontFamily: 'monospace',
            fontSize: '11px',
            fontStyle: 'bold',
            color: '#38bdf8'
        }).setOrigin(0.5);
        this.add(badgeText);

        // Station Title
        const titleText = scene.add.text(0, -112, milestoneData.title.split('—')[0].trim(), {
            fontFamily: '"Chakra Petch", sans-serif',
            fontSize: '13px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.add(titleText);

        // Floating Prompt Icon
        this.promptText = scene.add.text(0, -85, "[CLICK OR SPACE TO READ]", {
            fontFamily: 'monospace',
            fontSize: '10px',
            color: '#fef08a',
            backgroundColor: '#0f172a',
            padding: { x: 6, y: 3 }
        }).setOrigin(0.5);
        this.promptText.setVisible(false);
        this.add(this.promptText);

        // Gentle floating tween for prompt
        scene.tweens.add({
            targets: this.promptText,
            y: -89,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Click to open reader
        badgeBg.setInteractive({ useHandCursor: true });
        badgeBg.on('pointerdown', () => {
            scene.openMilestoneModal(this.milestone);
        });
        this.pavilionSprite.setInteractive({ useHandCursor: true });
        this.pavilionSprite.on('pointerdown', () => {
            scene.openMilestoneModal(this.milestone);
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

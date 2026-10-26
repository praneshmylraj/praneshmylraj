/**
 * Entity classes for Pranesh's World Runner
 * Includes Player, Glitch Bug, Security Drone, Moving Platform, Spring Pad, Terminal, and Checkpoint
 */

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player_idle_0');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(false);
        this.setSize(20, 36);
        this.setOffset(6, 4);

        // Movement constants
        this.MOVE_SPEED = 240;
        this.ACCEL = 1400;
        this.DRAG = 1200;
        this.JUMP_FORCE = -480;
        this.DOUBLE_JUMP_FORCE = -430;
        this.DASH_SPEED = 680;
        this.DASH_DURATION = 240; // ms
        this.DASH_COOLDOWN = 800; // ms

        // State
        this.canDoubleJump = true;
        this.isDashing = false;
        this.canDash = true;
        this.dashTimer = 0;
        this.dashCooldownTimer = 0;
        this.isSliding = false;
        this.facingRight = true;
        this.invulnerableTimer = 0;
        this.isDead = false;

        // Stats
        this.maxHealth = 3;
        this.health = 3;
        this.dashEnergy = 100; // 0 - 100%

        // Audio reference
        this.audio = window.soundEngine;

        // Particle trail timer
        this.ghostTimer = 0;
    }

    update(time, delta, cursors, keys) {
        if (this.isDead) return;

        const onGround = this.body.blocked.down || this.body.touching.down;

        // Recharge Dash Energy
        if (this.dashEnergy < 100) {
            this.dashEnergy = Math.min(100, this.dashEnergy + (delta / 1000) * 80);
        }

        // Invulnerability flicker
        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer -= delta;
            this.alpha = (Math.floor(time / 60) % 2 === 0) ? 0.3 : 1.0;
        } else {
            this.alpha = 1.0;
        }

        // Handle Active Dash
        if (this.isDashing) {
            this.dashTimer -= delta;
            this.spawnDashGhost(time);

            if (this.dashTimer <= 0) {
                this.isDashing = false;
                this.body.setMaxVelocity(this.MOVE_SPEED * 1.5, 1000);
            }
            return;
        }

        // Controls input checks
        const leftDown = Boolean(cursors?.left?.isDown || keys?.A?.isDown || window.virtualInput?.left);
        const rightDown = Boolean(cursors?.right?.isDown || keys?.D?.isDown || window.virtualInput?.right);
        const jumpPressed = Boolean(
            (cursors?.up && Phaser.Input.Keyboard.JustDown(cursors.up)) ||
            (keys?.W && Phaser.Input.Keyboard.JustDown(keys.W)) ||
            (keys?.SPACE && Phaser.Input.Keyboard.JustDown(keys.SPACE)) ||
            window.virtualInput?.consumeJump()
        );
        const dashPressed = Boolean(
            (keys?.SHIFT && Phaser.Input.Keyboard.JustDown(keys.SHIFT)) ||
            (keys?.J && Phaser.Input.Keyboard.JustDown(keys.J)) ||
            (keys?.X && Phaser.Input.Keyboard.JustDown(keys.X)) ||
            window.virtualInput?.consumeDash()
        );
        const downDown = Boolean(cursors?.down?.isDown || keys?.S?.isDown || window.virtualInput?.down);

        // Reset double jump on ground
        if (onGround) {
            this.canDoubleJump = true;
        }

        // Horizontal movement
        if (leftDown) {
            this.body.setAccelerationX(-this.ACCEL);
            this.facingRight = false;
            this.setFlipX(true);
        } else if (rightDown) {
            this.body.setAccelerationX(this.ACCEL);
            this.facingRight = true;
            this.setFlipX(false);
        } else {
            this.body.setAccelerationX(0);
            this.body.setDragX(this.DRAG);
        }

        // Slide / Fast Fall
        if (downDown && onGround && Math.abs(this.body.velocity.x) > 60) {
            this.isSliding = true;
            this.setSize(20, 20);
            this.setOffset(6, 20);
            this.setTexture('player_slide');
        } else {
            if (this.isSliding) {
                this.isSliding = false;
                this.setSize(20, 36);
                this.setOffset(6, 4);
            }
        }

        // Jump Handling
        if (jumpPressed) {
            if (onGround) {
                this.body.setVelocityY(this.JUMP_FORCE);
                this.audio.playJump();
                this.scene.spawnJumpParticles(this.x, this.y + 18);
            } else if (this.canDoubleJump) {
                this.body.setVelocityY(this.DOUBLE_JUMP_FORCE);
                this.canDoubleJump = false;
                this.audio.playDoubleJump();
                this.scene.spawnDoubleJumpRing(this.x, this.y + 10);
            }
        }

        // Dash Trigger
        if (dashPressed && this.dashEnergy >= 40 && !this.isDashing) {
            this.startDash();
        }

        // Animation state determination
        if (!this.isSliding) {
            if (!onGround) {
                if (this.body.velocity.y < -30) {
                    this.setTexture('player_jump');
                } else {
                    this.setTexture('player_fall');
                }
            } else {
                if (Math.abs(this.body.velocity.x) > 25) {
                    if (this.anims.currentAnim?.key !== 'p_run') {
                        this.play('p_run');
                    }
                } else {
                    if (this.anims.currentAnim?.key !== 'p_idle') {
                        this.play('p_idle');
                    }
                }
            }
        }
    }

    startDash() {
        this.isDashing = true;
        this.dashTimer = this.DASH_DURATION;
        this.dashEnergy -= 45;
        this.invulnerableTimer = this.DASH_DURATION + 100;

        const dir = this.facingRight ? 1 : -1;
        this.body.setMaxVelocity(this.DASH_SPEED, 1000);
        this.body.setVelocityX(dir * this.DASH_SPEED);
        this.body.setVelocityY(0);

        this.setTexture('player_dash');
        this.audio.playDash();

        // Screen shake flair
        this.scene.cameras.main.shake(120, 0.006);
    }

    spawnDashGhost(time) {
        if (time - this.ghostTimer > 45) {
            this.ghostTimer = time;
            const ghost = this.scene.add.sprite(this.x, this.y, this.texture.key);
            ghost.setFlipX(this.flipX);
            ghost.setTint(0x00f0ff);
            ghost.alpha = 0.6;
            this.scene.tweens.add({
                targets: ghost,
                alpha: 0,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                onComplete: () => ghost.destroy()
            });
        }
    }

    takeDamage(amount = 1) {
        if (this.invulnerableTimer > 0 || this.isDashing || this.isDead) return false;

        this.health -= amount;
        this.invulnerableTimer = 1200; // 1.2s i-frames
        this.audio.playHurt();
        this.scene.cameras.main.shake(200, 0.015);

        // Knockback
        const kbDir = this.facingRight ? -1 : 1;
        this.body.setVelocity(kbDir * 200, -250);

        if (this.health <= 0) {
            this.die();
        }
        return true;
    }

    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.body.setVelocity(0, 0);
        this.body.setAcceleration(0, 0);
        this.body.allowGravity = false;

        this.scene.spawnDeathParticles(this.x, this.y);
        this.setVisible(false);

        // Respawn at checkpoint after brief pause
        this.scene.time.delayedCall(800, () => {
            this.scene.respawnPlayer();
        });
    }

    respawn(x, y) {
        this.isDead = false;
        this.health = this.maxHealth;
        this.dashEnergy = 100;
        this.invulnerableTimer = 1500;
        this.setVisible(true);
        this.body.allowGravity = true;
        this.body.setVelocity(0, 0);
        this.setPosition(x, y);
    }
}

// ----------------------------------------------------
// Glitch Bug Enemy (Patrols platform, stomped or dashed)
// ----------------------------------------------------
class GlitchBug extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, distance = 120) {
        super(scene, x, y, 'enemy_bug_0');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.startX = x;
        this.patrolDistance = distance;
        this.speed = 50;
        this.direction = 1;

        this.setSize(18, 16);
        this.setOffset(3, 4);
        this.play('anim_bug');
        this.body.setVelocityX(this.speed);
    }

    update() {
        if (!this.active || !this.body) return;

        if (this.x > this.startX + this.patrolDistance) {
            this.direction = -1;
            this.setFlipX(true);
            this.body.setVelocityX(-this.speed);
        } else if (this.x < this.startX) {
            this.direction = 1;
            this.setFlipX(false);
            this.body.setVelocityX(this.speed);
        }
    }

    defeat() {
        window.soundEngine.playEnemyDefeat();
        this.scene.spawnExplosionParticles(this.x, this.y, 0xef4444);
        this.destroy();
    }
}

// ----------------------------------------------------
// Security Drone Enemy (Flying surveillance drone)
// ----------------------------------------------------
class SecurityDrone extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, rangeY = 80) {
        super(scene, x, y, 'enemy_drone_0');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.startY = y;
        this.rangeY = rangeY;
        this.body.allowGravity = false;
        this.setSize(24, 16);
        this.play('anim_drone');

        scene.tweens.add({
            targets: this,
            y: this.startY - rangeY,
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    defeat() {
        window.soundEngine.playEnemyDefeat();
        this.scene.spawnExplosionParticles(this.x, this.y, 0x06b6d4);
        this.destroy();
    }
}

// ----------------------------------------------------
// Moving Platform
// ----------------------------------------------------
class MovingPlatform extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, moveX = 140, moveY = 0, duration = 3000) {
        super(scene, x, y, 'tile_floating');
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // Static body for solid ride

        this.startX = x;
        this.startY = y;
        this.moveX = moveX;
        this.moveY = moveY;

        scene.tweens.add({
            targets: this,
            x: x + moveX,
            y: y + moveY,
            duration: duration,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            onUpdate: () => {
                this.refreshBody();
            }
        });
    }
}

// ----------------------------------------------------
// Interactive Lore Terminal
// ----------------------------------------------------
class LoreTerminal extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, loreData) {
        super(scene, x, y, 'terminal_pedestal');
        scene.add.existing(this);
        this.loreData = loreData;

        // Floating Prompt Icon
        this.promptText = scene.add.text(x, y - 32, '[E] ACCESS', {
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#00f0ff',
            backgroundColor: '#050b14',
            padding: { x: 4, y: 2 }
        }).setOrigin(0.5);

        this.promptText.setVisible(false);

        // Gentle hover float tween on prompt
        scene.tweens.add({
            targets: this.promptText,
            y: y - 36,
            duration: 900,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    setInRange(inRange) {
        this.promptText.setVisible(inRange);
    }
}

// ----------------------------------------------------
// Checkpoint Beacon Totem
// ----------------------------------------------------
class CheckpointBeacon extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, id) {
        super(scene, x, y, 'checkpoint_off');
        scene.add.existing(this);
        this.id = id;
        this.isActivated = false;
    }

    activate() {
        if (this.isActivated) return;
        this.isActivated = true;
        this.setTexture('checkpoint_on');
        window.soundEngine.playCheckpoint();

        // Particle flare
        this.scene.spawnExplosionParticles(this.x, this.y - 16, 0x00f0ff, 16);

        // Beacon light pillar effect
        const beam = this.scene.add.rectangle(this.x, this.y - 120, 6, 240, 0x00f0ff, 0.6);
        this.scene.tweens.add({
            targets: beam,
            alpha: 0,
            scaleX: 3,
            duration: 800,
            onComplete: () => beam.destroy()
        });
    }
}

window.Player = Player;
window.GlitchBug = GlitchBug;
window.SecurityDrone = SecurityDrone;
window.MovingPlatform = MovingPlatform;
window.LoreTerminal = LoreTerminal;
window.CheckpointBeacon = CheckpointBeacon;

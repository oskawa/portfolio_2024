export default class Player {
  constructor(x, y, width, height, spritesheet) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.width = width;
    this.height = height;

    this.spritesheet = spritesheet; // Image sprite
    this.direction = "right"; // Pour l'animation
    this.onGround = false;
    this.doubleJumpAvailable = true;
    this.state = "idle"; // idle, running, jumping, attacking, damaged

    this.comboStep = 0;
    this.comboResetTimer = 0;

    this.hitbox = {
      offsetX: 10,
      offsetY: 5,
      width: width - 20,
      height: height - 10,
    };
  }

  setAnimations(animations) {
    this.animations = animations;
    this.currentAnim = "idle";
    this.currentFrame = 0;
    this.frameTimer = 0;
  }
  playAnimation(name) {
    if (this.currentAnim !== name) {
      this.currentAnim = name;
      this.currentFrame = 0;
      this.frameTimer = 0;

      const anim = this.animations[name];
      if (anim && anim.frames.length > 0) {
        const firstFrame = anim.frames[0];
        this.width = firstFrame.w;
        this.height = firstFrame.h;
      }
    }
  }
  updateAnimation(deltaTime) {
    const anim = this.animations[this.currentAnim];
    if (!anim) return;

    this.frameTimer += deltaTime;
    if (this.frameTimer >= anim.frameDuration) {
      this.frameTimer = 0;

      if (anim.loop) {
        this.currentFrame = (this.currentFrame + 1) % anim.frames.length;
      } else {
        // Only increment if not on the last frame
        if (this.currentFrame < anim.frames.length - 1) {
          this.currentFrame++;
        }
        // Else: stay on the last frame
      }
    }
  }

  getHitbox() {
    return {
      x: this.position.x + this.hitbox.offsetX,
      y: this.position.y + this.hitbox.offsetY,
      width: this.hitbox.width,
      height: this.hitbox.height,
    };
  }

  move(input) {
    const speed = 2.5;
    if (input.left) {
      this.velocity.x = -speed;
      this.direction = "left";
      if (this.onGround) {
        this.playAnimation("run");
      }
    } else if (input.right) {
      this.velocity.x = speed;
      this.direction = "right";
      if (this.onGround) {
        this.playAnimation("run");
      }
    } else {
      this.velocity.x = 0;
      if (this.onGround && this.state !== "attacking") {
        this.playAnimation("idle");
      }
    }
  }

  jump() {
    if (this.onGround) {
      this.velocity.y = -12;
      this.onGround = false;
      this.doubleJumpAvailable = true;
      this.playAnimation("jump");
    } else if (this.doubleJumpAvailable) {
      this.velocity.y = -12;
      this.doubleJumpAvailable = false;
      this.playAnimation("jumptwo");
    }
  }

  attack() {
    console.log("ATTACK");
    if (this.state !== "attacking") {
      this.comboStep++;
      if (this.comboStep > 4) this.comboStep = 1;
      const animName = `fight${
        ["one", "two", "three", "four"][this.comboStep - 1]
      }`;

      this.playAnimation(animName);

      this.state = "attacking";
      this.attackTimer = this.comboStep === 4 ? 600 : 300;
      this.comboResetTimer = 1000;

      // Create an attack hitbox
      this.attackHitbox = {
        x: this.position.x + (this.direction === "right" ? this.width : -20),
        y: this.position.y + 10,
        width: 20,
        height: 30,
      };
    }
  }

  update(deltaTime, gravity) {
    this.updateAnimation(deltaTime);

    // 🗡️ Handle attack timing
    if (this.state === "attacking") {
      this.attackTimer -= deltaTime;
      if (this.attackTimer <= 0) {
        this.state = "idle";
        this.attackHitbox = null;
      }
    }
    if (this.comboStep > 0) {
      this.comboResetTimer -= deltaTime;
      if (this.comboResetTimer <= 0) {
        this.comboStep = 0;
      }
    }

    this.velocity.y += gravity;

    this.position.x += this.velocity.x;

    const hitbox = this.getHitbox();

    this.position.y += this.velocity.y;
    this.onGround = false;
  }

  draw(ctx, camera) {
    const anim = this.animations[this.currentAnim];
    if (!anim || !anim.image) return;
    const hitbox = this.getHitbox();
    const frame = anim.frames[this.currentFrame];
    const screenX = this.position.x - camera.x;
    const screenY = this.position.y - camera.y;

    ctx.save();

    // Center the drawing around the player's position
    ctx.translate(screenX + this.width / 2, screenY + this.height / 2);

    // Flip horizontally if facing left
    ctx.scale(this.direction === "left" ? -1 : 1, 1);

    // Draw the image flipped if needed
    ctx.drawImage(
      anim.image,
      frame.x,
      frame.y,
      frame.w,
      frame.h,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    ctx.restore();

    ctx.save();

    ctx.restore();
  }

  drawDebugHitbox(ctx, camera) {
    const hitbox = this.getHitbox();

    ctx.save();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    ctx.strokeRect(
      hitbox.x - camera.x,
      hitbox.y - camera.y,
      hitbox.width,
      hitbox.height
    );

    if (this.attackHitbox) {
      ctx.strokeStyle = "orange";
      ctx.strokeRect(
        this.attackHitbox.x - camera.x,
        this.attackHitbox.y - camera.y,
        this.attackHitbox.width,
        this.attackHitbox.height
      );
    }

    ctx.restore();
  }
}

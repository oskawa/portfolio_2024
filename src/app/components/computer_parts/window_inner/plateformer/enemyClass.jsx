export default class Enemy {
  constructor(x, y, width, height, type = "walker", hp = 3) {
    this.position = { x, y };
    this.width = width;
    this.height = height;
    this.type = type;
    this.hp = hp;
    this.direction = "left";
    this.speed = 1;
    this.hitbox = {
      offsetX: 5,
      offsetY: 5,
      width: width - 10,
      height: height - 10,
    };
  }

  getHitbox() {
    return {
      x: this.position.x + this.hitbox.offsetX,
      y: this.position.y + this.hitbox.offsetY,
      width: this.hitbox.width,
      height: this.hitbox.height,
    };
  }

  update(zones, gravity = 0.5) {
    if (this.dead) return;

    this.velocity = this.velocity || { x: 0, y: 0 };
    this.velocity.y += gravity;

    this.position.x += this.direction === "left" ? -this.speed : this.speed;
    this.position.y += this.velocity.y;

    // Check ground collision (basic)
    const hitbox = this.getHitbox();
    for (const zone of zones) {
      if (!zone) continue;

      const eBottom = hitbox.y + hitbox.height;
      const eTop = hitbox.y;
      const eX = hitbox.x + hitbox.width / 2;

      const inHorizontal = eX > zone.x && eX < zone.x + zone.width;
      const groundY = zone.isSlope ? zone.getYat(eX) : zone.y;

      if (inHorizontal && eBottom >= groundY && eTop < groundY + zone.height) {
        this.velocity.y = 0;
        this.position.y = groundY - this.height;
      }
    }
  }

  draw(ctx, camera) {
    ctx.fillStyle = "purple";
    ctx.fillRect(
      this.position.x - camera.x,
      this.position.y - camera.y,
      this.width,
      this.height
    );
  }

  drawDebugHitbox(ctx, camera) {
    const hitbox = this.getHitbox();
    ctx.strokeStyle = "lime";
    ctx.strokeRect(
      hitbox.x - camera.x,
      hitbox.y - camera.y,
      hitbox.width,
      hitbox.height
    );
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.dead = true;
    }
  }
}

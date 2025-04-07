export default class Trigger {
  constructor({ x, y, width, height, action, data }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.action = action; // "read", "change_level", etc.
    this.data = data || {};
  }

  intersects(player) {
    const hitbox = player.getHitbox();
    return (
      hitbox.x < this.x + this.width &&
      hitbox.x + hitbox.width > this.x &&
      hitbox.y < this.y + this.height &&
      hitbox.y + hitbox.height > this.y
    );
  }

  drawDebug(ctx, camera) {
    ctx.save();
    ctx.strokeStyle = "cyan";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      this.x - camera.x,
      this.y - camera.y,
      this.width,
      this.height
    );
    ctx.restore();
  }
}

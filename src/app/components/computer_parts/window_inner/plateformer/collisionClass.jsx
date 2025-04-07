// /classes/CollisionZone.js

export default class CollisionZone {
  constructor({
    x,
    y,
    width,
    height,
    isSlope = false,
    slope = 0,
    collisionType = "solid",
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.isSlope = isSlope;
    this.slope = slope;
    this.collisionType = collisionType;
  }

  getYat(x) {
    if (!this.isSlope) return this.y;
    // Calculate height at specific X for slope
    const relativeX = x - this.x;
    return this.y + this.height - relativeX * this.slope;
  }

  collidesWith(player) {
    const playerBottom = player.position.y + player.height;
    const playerTop = player.position.y;
    const playerLeft = player.position.x;
    const playerRight = player.position.x + player.width;
    const playerMidX = player.position.x + player.width / 2;

    const inHorizontal =
      playerRight > this.x && playerLeft < this.x + this.width;

    if (!inHorizontal) return false;

    const groundY = this.isSlope ? this.getYat(playerMidX) : this.y;

    const playerIsFalling = player.velocity.y > 0;
    const justAbove = playerBottom >= groundY && playerTop < groundY;

    switch (this.collisionType) {
      case "oneWay":
        return playerIsFalling && justAbove;

      case "solid":
      default:
        return playerBottom >= groundY && playerTop < groundY + this.height;
    }
  }
}

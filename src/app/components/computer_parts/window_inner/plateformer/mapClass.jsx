import CollisionZone from "./collisionClass";

export default class GameMap {
  constructor(
    image,
    width,
    height,
    canvasWidth,
    canvasHeight,
    backgroundImage = null
  ) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.backgroundImage = backgroundImage;

    this.camera = { x: 0, y: 0 };
    this.zones = [];
  }
  addZone(zoneData) {
    const zone = new CollisionZone(zoneData);
    this.zones.push(zone);
  }

  checkCollisions(player) {
    for (const zone of this.zones) {
      if (zone.collidesWith(player)) {
        // Snap player to the top of the zone
        const groundY = zone.isSlope
          ? zone.getYat(player.position.x + player.width / 2)
          : zone.y;
        player.position.y = groundY - player.height;
        player.velocity.y = 0;
        player.onGround = true;
        return;
      }
    }
    player.onGround = false;
  }

  update(player) {
    const halfCanvasW = this.canvasWidth / 2;
    const halfCanvasH = this.canvasHeight / 2;
    const zoom = 2;
    const scaledCanvasW = this.canvasWidth / zoom;
    const scaledCanvasH = this.canvasHeight / zoom;

    this.camera.x = Math.max(
      0,
      Math.min(
        player.position.x - scaledCanvasW / 2,
        this.width - scaledCanvasW
      )
    );

    this.camera.y = Math.max(
      0,
      Math.min(
        player.position.y - scaledCanvasH / 2,
        this.height - scaledCanvasH
      )
    );

    this.checkCollisions(player);
  }

  draw(ctx) {
    // Draw background (with parallax)
    if (this.backgroundImage) {
      const parallaxFactor = 0.05;
      const bgX = this.camera.x * parallaxFactor;
      const bgY = this.camera.y * parallaxFactor;

      ctx.drawImage(
        this.backgroundImage,
        bgX,
        bgY,
        this.canvasWidth,
        this.canvasHeight,
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
      );
    }

    // Draw foreground level
    ctx.drawImage(
      this.image,
      this.camera.x,
      this.camera.y,
      this.canvasWidth,
      this.canvasHeight,
      0,
      0,
      this.canvasWidth,
      this.canvasHeight
    );
  }
  // In /classes/GameMap.js (bottom of class)
  drawDebugZones(ctx) {
    ctx.save();
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 2;

    for (const zone of this.zones) {
      const screenX = zone.x - this.camera.x;
      const screenY = zone.y - this.camera.y;

      if (zone.isSlope) {
        // Draw slope shape
        ctx.beginPath();
        ctx.moveTo(screenX, screenY + zone.height);
        ctx.lineTo(
          screenX + zone.width,
          screenY + zone.height - zone.width * zone.slope
        );
        ctx.stroke();
      } else {
        // Draw flat box
        ctx.strokeRect(screenX, screenY, zone.width, zone.height);
      }
    }

    ctx.restore();
  }

  getPixelData(ctx) {
    return ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
  }
}

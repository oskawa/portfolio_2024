"use client";
import { useRef, useEffect } from "react";
import Player from "./plateformer/playerClass";
import GameMap from "./plateformer/mapClass";
import Trigger from "./plateformer/triggerClass";
import Enemy from "./plateformer/enemyClass";
import levels from "./plateformer/level";
import styles from "./plateformer.module.scss";

function generateFrames({ frameWidth, frameHeight, count, row = 0 }) {
  const frames = [];
  for (let i = 0; i < count; i++) {
    frames.push({
      x: i * frameWidth,
      y: row * frameHeight,
      w: frameWidth,
      h: frameHeight,
    });
  }
  return frames;
}

function loadLevel(levelKey, canvasWidth, canvasHeight, callback) {
  const levelData = levels[levelKey];
  const levelImage = new Image();
  levelImage.src = levelData.imageSrc;
  const bgImage = new Image();
  bgImage.src = levelData.backgroundSrc;

 
  let loaded = 0;
  const onLoad = () => {
    loaded++;
    if (loaded === 2) {
      const map = new GameMap(
        levelImage,
        levelImage.width,
        levelImage.height,
        canvasWidth,
        canvasHeight,
        bgImage
      );

      for (const zone of levelData.zones) {
        map.addZone(zone);
      }
      const enemies = [];

      if (levelData.enemies) {
        for (const data of levelData.enemies) {
          enemies.push(
            new Enemy(data.x, data.y, data.width, data.height, data.type)
          );
        }
      }
      map.triggers = (levelData.triggers || []).map(
        (triggerData) => new Trigger(triggerData)
      );

      map.enemies = enemies;

      callback(map);
    }
  };

  levelImage.onload = onLoad;
  bgImage.onload = onLoad;
}

function handleTrigger(trigger) {
  console.log("toto");
}
export function PlateformerWindow() {
  const canvasRef = useRef(null);
  const canvasWidth = 480;
  const canvasHeight = 320;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const idleImage = new Image();
    idleImage.src = "/img/plateformer/sprites/main_character/idle.png"; // Make sure this exists in /public
    const runImage = new Image();
    runImage.src = "/img/plateformer/sprites/main_character/run.png"; // Make sure this exists in /public
    const jumpImage = new Image();
    jumpImage.src = "/img/plateformer/sprites/main_character/jump.png"; // Make sure this exists in /public
    const jumptwoImage = new Image();
    jumptwoImage.src = "/img/plateformer/sprites/main_character/jumptwo.png"; // Make sure this exists in /public
    const fightoneImage = new Image();
    fightoneImage.src = "/img/plateformer/sprites/main_character/fightone.png"; // Make sure this exists in /public

    idleImage.onload = () => {
      loadLevel("level1", canvasWidth, canvasHeight, (map) => {
        const player = new Player(1900, 100, 40, 50, null);

        const keys = { left: false, right: false, up: false };

        document.addEventListener("keydown", (e) => {
          if (e.key === "ArrowLeft") keys.left = true;
          if (e.key === "ArrowRight") keys.right = true;
          if (e.key === " " || e.key === "ArrowUp") player.jump();
          if (e.key === "f") player.attack();
          if (e.key === "e") keys.action = true; // optional action key
        });

        document.addEventListener("keyup", (e) => {
          if (e.key === "ArrowLeft") keys.left = false;
          if (e.key === "ArrowRight") keys.right = false;
          if (e.key === "e") keys.action = false;
        });

        player.setAnimations({
          idle: {
            image: idleImage,
            loop: true,
            frameDuration: 120, // 120 ms per frame
            frames: generateFrames({
              frameWidth: 36,
              frameHeight: 36, // or your real height
              count: 6,
            }),
          },
          run: {
            image: runImage,
            loop: true,
            frameDuration: 120, // 120 ms per frame
            frames: generateFrames({
              frameWidth: 38,
              frameHeight: 43, // or your real height
              count: 8,
            }),
          },
          jump: {
            image: jumpImage,
            loop: false,
            frameDuration: 120, // 120 ms per frame
            frames: generateFrames({
              frameWidth: 36,
              frameHeight: 41, // or your real height
              count: 9,
            }),
          },
          jumptwo: {
            loop: false,
            image: jumptwoImage,
            frameDuration: 120, // 120 ms per frame
            frames: generateFrames({
              frameWidth: 36,
              frameHeight: 32, // or your real height
              count: 6,
            }),
          },
          fightone: {
            loop: true,
            image: fightoneImage,
            frameDuration: 120, // 120 ms per frame
            frames: generateFrames({
              frameWidth: 34,
              frameHeight: 36, // or your real height
              count: 6,
            }),
          },
        });

        let lastTime = 0;
        function gameLoop(time = 0) {
          const deltaTime = time - lastTime;
          lastTime = time;

          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          player.move(keys);
          player.update(deltaTime, 0.5);
          map.update(player);

          map.draw(ctx);
          map.drawDebugZones(ctx);
          if (map.triggers) {
            for (const trigger of map.triggers) {
              if (trigger.intersects(player) && keys.action) {
                handleTrigger(trigger);
              }
            }
          }
          // Update & draw enemies
          for (const enemy of map.enemies) {
            if (enemy.dead) continue;
           
            enemy.update(map.zones, 0.5);
            enemy.draw(ctx, map.camera);
            enemy.drawDebugHitbox(ctx, map.camera);

            // Check for attack collision
            if (player.attackHitbox) {
              const hit = player.attackHitbox;
              const eHitbox = enemy.getHitbox();

              const isTouching =
                hit.x < eHitbox.x + eHitbox.width &&
                hit.x + hit.width > eHitbox.x &&
                hit.y < eHitbox.y + eHitbox.height &&
                hit.y + hit.height > eHitbox.y;

              if (isTouching) {
                enemy.takeDamage(1);
              }
            }
          }
          for (const trigger of map.triggers) {
            trigger.drawDebug(ctx, map.camera); // 🧪 DEBUG STROKE

            if (trigger.intersects(player) && keys.action) {
              handleTrigger(trigger);
            }
          }

          player.draw(ctx, map.camera);
          player.drawDebugHitbox(ctx, map.camera);

          requestAnimationFrame(gameLoop);
        }

        requestAnimationFrame(gameLoop);
      });
    };
  }, []);

  return (
    <div className={styles.plateformer}>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </div>
  );
}

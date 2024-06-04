import * as PIXI from "pixi.js";
import { Game } from "../Game";
import { Bullet } from "./Bullet";

export class Tank {
  public sprite: PIXI.Sprite;
  public bullets: Bullet[] = [];
  private app: PIXI.Application;
  private damage: number;
  private bulletCount: number;
  private lastFireTime: number = 0;
  private fireDelay: number = 500; // delay in milliseconds
  private game: Game;
  public initialCameraX: number;
  public initialCameraY: number;
  public stepCounter: number = 0;
  private currentDirection = "right";

  /**
   * Creates an instance of Tank.
   * @param app - The PIXI application instance.
   * @param color - The color of the tank.
   * @param damage - The damage each bullet inflicts.
   * @param bulletCount - The number of bullets fired at once.
   * @param game - The game instance.
   */
  constructor(
    app: PIXI.Application,
    color: string,
    damage: number,
    bulletCount: number,
    game: Game
  ) {
    this.app = app;
    this.damage = damage;
    this.bulletCount = bulletCount;
    this.game = game;
    this.sprite = this.createTankSprite(color);
    this.initialCameraX = this.sprite.x;
    this.initialCameraY = this.sprite.y;

    this.app.stage.addChild(this.sprite);
  }

  /**
   * Creates a sprite for the tank with the specified color.
   * @param color - The color of the tank.
   * @returns PIXI.Sprite - The created tank sprite.
   */
  private createTankSprite(color: string): PIXI.Sprite {
    const sprite = PIXI.Sprite.from(`assets/images/tank_${color}.png`);
    if (color === "green") {
      sprite.scale.set(-1, 1); // Flip the green tank
    }
    sprite.anchor.set(0.5);
    sprite.width = 77;
    sprite.height = 77;
    return sprite;
  }

  /**
   * Moves the tank up.
   */
  public moveUp(): void {
    this.moveTank(0, -25, -Math.PI / 2);
    this.currentDirection = "up";
  }

  /**
   * Moves the tank down.
   */
  public moveDown(): void {
    this.moveTank(0, 25, Math.PI / 2);
    this.currentDirection = "down";
  }

  /**
   * Moves the tank left.
   */
  public moveLeft(): void {
    this.moveTank(-25, 0, Math.PI);
    this.sprite.scale.y = -1;
    this.sprite.width = 77;
    this.sprite.height = 77;
    this.currentDirection = "left";
  }

  /**
   * Moves the tank right.
   */
  public moveRight(): void {
    this.moveTank(25, 0, 0);
    this.sprite.scale.y = 1;
    this.sprite.width = 77;
    this.sprite.height = 77;
    this.currentDirection = "right";
  }

  /**
   * Moves the tank by the specified offsets and rotation.
   * @param offsetX - The offset in the x-direction.
   * @param offsetY - The offset in the y-direction.
   * @param rotation - The rotation angle.
   */
  private moveTank(offsetX: number, offsetY: number, rotation: number): void {
    this.sprite.x += offsetX;
    this.sprite.y += offsetY;
    this.sprite.rotation = rotation;
    this.stepCounter++;
  }

  /**
   * Fires bullets from the tank.
   */
  public fire(): void {
    const currentTime = Date.now();
    if (currentTime - this.lastFireTime >= this.fireDelay) {
      this.createBullets();
      this.lastFireTime = currentTime;
    }
  }

  /**
   * Creates bullets and adds them to the game.
   */
  private createBullets(): void {
    for (let i = 0; i < this.bulletCount; i++) {
      let offsetX = 0;
      let offsetY = (i - (this.bulletCount - 1) / 2) * 10; // Adjust y position for each bullet
      if (["up", "down"].includes(this.currentDirection)) {
        offsetX = (i - (this.bulletCount - 1) / 2) * 10; // Adjust x position for each bullet
        offsetY = 0;
      }
      const bullet = new Bullet(
        this.app,
        this.sprite.x + offsetX,
        this.sprite.y + offsetY,
        this.damage,
        this.sprite.rotation,
        this.game
      );
      this.bullets.push(bullet);
    }
  }

  /**
   * Undoes the last movement of the tank.
   */
  public undoMove(): void {
    this.sprite.x -= Math.cos(this.sprite.rotation) * 35;
    this.sprite.y -= Math.sin(this.sprite.rotation) * 35;
  }
}

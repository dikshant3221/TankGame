import * as PIXI from "pixi.js";
import { Game } from "../Game";

export class Bullet {
  public sprite: PIXI.Sprite;
  public damage: number;
  private app: PIXI.Application;
  private destroyed: boolean = false;
  private game: Game;

  /**
   * Creates an instance of Bullet.
   * @param app - The PIXI application instance.
   * @param x - The x-coordinate of the bullet.
   * @param y - The y-coordinate of the bullet.
   * @param damage - The damage the bullet can inflict.
   * @param rotation - The rotation of the bullet.
   * @param game - The game instance.
   */
  constructor(app: PIXI.Application, x: number, y: number, damage: number, rotation: number, game: Game) {
    this.app = app;
    this.game = game;
    this.damage = damage;
    this.sprite = this.createSprite(x, y, rotation);
    this.app.stage.addChild(this.sprite);
    this.app.ticker.add(this.update.bind(this));
  }

  /**
   * Creates the bullet sprite.
   * @param x - The x-coordinate of the bullet.
   * @param y - The y-coordinate of the bullet.
   * @param rotation - The rotation of the bullet.
   * @returns PIXI.Sprite - The created bullet sprite.
   */
  private createSprite(x: number, y: number, rotation: number): PIXI.Sprite {
    const sprite = PIXI.Sprite.from("assets/bullet.png");
    sprite.anchor.set(0.5);
    sprite.width = 22;
    sprite.height = 22;
    sprite.x = x;
    sprite.y = y;
    sprite.rotation = rotation;
    return sprite;
  }

  /**
   * Updates the bullet's position and checks for collisions.
   * @param delta - The time delta for the update.
   */
  private update(delta: number): void {
    if (this.destroyed) return;
    this.moveBullet(delta);
    if (this.isOutOfBounds() || this.isCollidingWithWalls()) {
      this.destroy();
    }
  }

  /**
   * Moves the bullet based on its rotation.
   * @param delta - The time delta for the movement.
   */
  private moveBullet(delta: number): void {
    this.sprite.x += Math.cos(this.sprite.rotation) * 5 * delta;
    this.sprite.y += Math.sin(this.sprite.rotation) * 5 * delta;
  }

  /**
   * Checks if the bullet is out of screen bounds.
   * @returns boolean - True if out of bounds, false otherwise.
   */
  private isOutOfBounds(): boolean {
    return (
      this.sprite.x < 0 ||
      this.sprite.x > this.app.screen.width ||
      this.sprite.y < 0 ||
      this.sprite.y > this.app.screen.height
    );
  }

  /**
   * Checks if the bullet is colliding with any walls.
   * @returns boolean - True if colliding with walls, false otherwise.
   */
  private isCollidingWithWalls(): boolean {
    return this.game.walls.some((wall) =>
      this.game.collisionManager.isColliding(this.sprite, wall.sprite)
    );
  }

  /**
   * Destroys the bullet, removing it from the stage and ticker.
   */
  public destroy(): void {
    if (!this.destroyed) {
      this.destroyed = true;
      this.app.stage.removeChild(this.sprite);
      this.app.ticker.remove(this.update.bind(this));
    }
  }
}

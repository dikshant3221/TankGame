import * as PIXI from "pixi.js";
import { Game } from "../Game";

export class Hay {
  public sprite: PIXI.Sprite;
  public health: number;
  private app: PIXI.Application;
  private game: Game;

  /**
   * Creates an instance of Hay.
   * @param app - The PIXI application instance.
   * @param game - The game instance.
   * @param x - The x-coordinate of the hay.
   * @param y - The y-coordinate of the hay.
   * @param health - The initial health of the hay.
   */
  constructor(app: PIXI.Application, game: Game, x: number, y: number, health: number) {
    this.app = app;
    this.game = game;
    this.health = health;
    this.sprite = this.createSprite(x, y);
    this.app.stage.addChild(this.sprite);
  }

  /**
   * Creates the hay sprite.
   * @param x - The x-coordinate of the hay.
   * @param y - The y-coordinate of the hay.
   * @returns PIXI.Sprite - The created hay sprite.
   */
  private createSprite(x: number, y: number): PIXI.Sprite {
    const sprite = PIXI.Sprite.from("assets/images/hay.png");
    sprite.anchor.set(0.5);
    sprite.x = x;
    sprite.y = y;
    sprite.width = 44;
    sprite.height = 44;
    return sprite;
  }

  /**
   * Reduces the hay's health by the specified damage amount.
   * Removes the hay from the game if health drops to zero or below.
   * @param damage - The amount of damage to inflict.
   */
  public takeDamage(damage: number): void {
    this.health -= damage;
    if (this.isDestroyed()) {
      this.removeHay();
    }
  }

  /**
   * Checks if the hay is destroyed (health <= 0).
   * @returns boolean - True if the hay is destroyed, false otherwise.
   */
  public isDestroyed(): boolean {
    return this.health <= 0;
  }

  /**
   * Removes the hay sprite from the stage and the game.
   */
  private removeHay(): void {
    this.app.stage.removeChild(this.sprite);
    this.game.removeHay(this);
  }
}

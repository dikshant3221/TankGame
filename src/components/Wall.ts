import * as PIXI from "pixi.js";

export class Wall {
  public sprite: PIXI.Sprite;
  private app: PIXI.Application;

  /**
   * Creates an instance of Wall.
   * @param app - The PIXI application instance.
   * @param x - The x-coordinate for the wall.
   * @param y - The y-coordinate for the wall.
   */
  constructor(app: PIXI.Application, x: number, y: number) {
    this.app = app;
    this.sprite = this.createWallSprite(x, y);
    this.addWallToStage(this.sprite);
  }

  /**
   * Creates a sprite for the wall at the given coordinates.
   * @param x - The x-coordinate for the wall.
   * @param y - The y-coordinate for the wall.
   * @returns PIXI.Sprite - The created wall sprite.
   */
  private createWallSprite(x: number, y: number): PIXI.Sprite {
    const sprite = PIXI.Sprite.from("assets/wall.png");
    sprite.anchor.set(0.5); 
    sprite.width = 44; 
    sprite.height = 22; 
    sprite.x = x; 
    sprite.y = y; 
    return sprite;
  }

  /**
   * Adds the wall sprite to the application's stage.
   * @param sprite - The wall sprite to add to the stage.
   */
  private addWallToStage(sprite: PIXI.Sprite): void {
    this.app.stage.addChild(sprite);
  }
}

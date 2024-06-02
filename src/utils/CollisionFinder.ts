import * as PIXI from "pixi.js";

export class CollisionFinder {
  /**
   * Checks if two sprites are colliding.
   * @param sprite1 - The first sprite to check.
   * @param sprite2 - The second sprite to check.
   * @returns boolean - True if the sprites are colliding, false otherwise.
   */
  public isColliding(sprite1: PIXI.Sprite, sprite2: PIXI.Sprite): boolean {
    const bounds1 = this.getSpriteBounds(sprite1);
    const bounds2 = this.getSpriteBounds(sprite2);

    return this.areBoundsOverlapping(bounds1, bounds2);
  }

  /**
   * Gets the bounding box of a sprite.
   * @param sprite - The sprite to get the bounds of.
   * @returns PIXI.Rectangle - The bounding box of the sprite.
   */
  private getSpriteBounds(sprite: PIXI.Sprite): PIXI.Rectangle {
    return sprite.getBounds();
  }

  /**
   * Checks if two bounding boxes are overlapping.
   * @param bounds1 - The first bounding box to check.
   * @param bounds2 - The second bounding box to check.
   * @returns boolean - True if the bounding boxes are overlapping, false otherwise.
   */
  private areBoundsOverlapping(bounds1: PIXI.Rectangle, bounds2: PIXI.Rectangle): boolean {
    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
  }
}

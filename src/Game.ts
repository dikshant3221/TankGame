import * as PIXI from "pixi.js";
import { Tank } from "./components/Tank";
import { Wall } from "./components/Wall";
import { Hay } from "./components/Hay";
import { Keyboard } from "./utils/Keyboard";
import { CollisionFinder } from "./utils/CollisionFinder";
import { Bullet } from "./components/Bullet";

export class Game {
  private app: PIXI.Application;
  private tanks: Tank[] = [];
  public walls: Wall[] = [];
  private hays: Hay[] = [];
  private keyboard: Keyboard;
  public collisionManager: CollisionFinder;
  private currentTankIndex: number = 0;
  private preventScrolling: boolean = true;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.keyboard = new Keyboard(this);
    this.collisionManager = new CollisionFinder();
  }

  /**
   * Removes a hay object from the game.
   * @param hay - The hay object to remove.
   */
  public removeHay(hay: Hay) {
    const index = this.hays.indexOf(hay);
    if (index !== -1) {
      this.hays.splice(index, 1);
    }
  }

  /**
   * Starts the game by initializing tanks, walls, hays, and keyboard controls.
   */
  public start() {
    this.resetCameraPosition();
    this.createTanks();
    this.createWalls();
    this.createHays();
    this.setupKeyboardControls();
    this.app.ticker.add(this.update.bind(this));
  }

  /**
   * Resets the camera position to the top-left corner.
   */
  private resetCameraPosition() {
    this.app.stage.x = 0;
    this.app.stage.y = 0;
  }

  /**
   * Creates tank objects and adds them to the game.
   */
  private createTanks() {
    const redTank = new Tank(this.app, "red", 10, 2, this);
    const blueTank = new Tank(this.app, "blue", 20, 3, this);
    const greenTank = new Tank(this.app, "green", 25, 1, this);

    this.setPosition(redTank, 1, 1);
    this.setPosition(blueTank, 3, 1);
    this.setPosition(greenTank, 5, 1);

    blueTank.sprite.visible = false;
    greenTank.sprite.visible = false;

    this.tanks.push(redTank, blueTank, greenTank);
  }

  /**
   * Sets the position of a tank based on grid coordinates.
   * @param tank - The tank to position.
   * @param gridX - The x-coordinate in the grid.
   * @param gridY - The y-coordinate in the grid.
   */
  private setPosition(tank: Tank, gridX: number, gridY: number) {
    tank.sprite.x = gridX * 35;
    tank.sprite.y = gridY * 35;
  }

  /**
   * Creates wall objects and adds them to the game.
   */
  private createWalls() {
    for (let i = 0; i < 50; i++) {
      const { x, y } = this.getRandomPosition();
      const wall = new Wall(this.app, x, y);
      this.walls.push(wall);
    }
  }

  /**
   * Creates hay objects and adds them to the game.
   */
  private createHays() {
    for (let i = 0; i < 25; i++) {
      const { x, y } = this.getRandomPosition();
      const hay = new Hay(this.app, this, x, y, 100);
      this.hays.push(hay);
    }
  }

  /**
   * Generates a random position on the grid that is not occupied.
   * @returns The x and y coordinates of the position.
   */
  private getRandomPosition() {
    let x, y, validPosition;
    do {
      x = Math.floor(Math.random() * 50) * 35;
      y = Math.floor(Math.random() * 50) * 35;
      validPosition = !this.isPositionOccupied(x, y);
    } while (!validPosition);
    return { x, y };
  }

  /**
   * Checks if a position is occupied by a tank, wall, or hay.
   * @param x - The x-coordinate of the position.
   * @param y - The y-coordinate of the position.
   * @returns True if the position is occupied, otherwise false.
   */
  private isPositionOccupied(x: number, y: number): boolean {
    return (
      this.walls.some((wall) => wall.sprite.x === x && wall.sprite.y === y) ||
      this.hays.some((hay) => hay.sprite.x === x && hay.sprite.y === y) ||
      this.tanks.some((tank) => tank.sprite.x === x && tank.sprite.y === y)
    );
  }

  /**
   * Updates the camera position based on the current tank's position.
   */
  private updateCamera() {
    const tank = this.getCurrentTank();
    if (tank.stepCounter >= 3) {
      const { newCameraX, newCameraY, maxCameraX, maxCameraY } =
        this.calculateCameraBounds(tank);
      this.app.stage.x = Math.max(Math.min(-newCameraX, 0), maxCameraX);
      this.app.stage.y = Math.max(Math.min(-newCameraY, 0), maxCameraY);
      tank.stepCounter = 0;
      this.preventScrolling = false;
    } else {
      this.preventScrolling = true;
    }
  }

  /**
   * Calculates the new camera position and bounds.
   * @param tank - The current tank.
   * @returns The new camera x, y positions and maximum camera x, y bounds.
   */
  private calculateCameraBounds(tank: Tank) {
    const newCameraX = tank.sprite.x - this.app.screen.width / 2;
    const newCameraY = tank.sprite.y - this.app.screen.height / 2;
    const maxCameraX = -(35 * 50 - this.app.screen.width);
    const maxCameraY = -(130 * 50 - this.app.screen.height);
    return { newCameraX, newCameraY, maxCameraX, maxCameraY };
  }

  /**
   * Sets up keyboard controls for the game.
   */
  private setupKeyboardControls() {
    window.addEventListener("keydown", this.handleKeydown.bind(this));
    this.keyboard.addKey("ArrowUp", () => this.moveCurrentTank("up"));
    this.keyboard.addKey("ArrowDown", () => this.moveCurrentTank("down"));
    this.keyboard.addKey("ArrowLeft", () => this.moveCurrentTank("left"));
    this.keyboard.addKey("ArrowRight", () => this.moveCurrentTank("right"));
    this.keyboard.addKey("KeyT", () => this.switchTank());
  }

  /**
   * Handles keydown events for the game.
   * @param e - The keyboard event.
   */
  private handleKeydown(e: KeyboardEvent) {
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(
        e.code
      )
    ) {
      if (e.code === "Space") {
        e.preventDefault();
        this.getCurrentTank().fire();
      } else if (this.preventScrolling) {
        e.preventDefault();
      }
    }
  }

  /**
   * Gets the current tank based on the index.
   * @returns The current tank.
   */
  private getCurrentTank(): Tank {
    return this.tanks[this.currentTankIndex];
  }

  /**
   * Switches to the next tank.
   */
  private switchTank() {
    const currentTank = this.getCurrentTank();
    currentTank.sprite.visible = false;
    this.currentTankIndex = (this.currentTankIndex + 1) % this.tanks.length;
    const newTank = this.getCurrentTank();
    newTank.sprite.x = currentTank.sprite.x;
    newTank.sprite.y = currentTank.sprite.y;
    newTank.sprite.visible = true;
    this.resetCameraPosition();
  }

  /**
   * Moves the current tank in the specified direction.
   * @param direction - The direction to move the tank.
   */
  private moveCurrentTank(direction: string) {
    const tank = this.getCurrentTank();
    const { oldX, oldY } = this.saveOldPosition(tank);
    this.moveTankInDirection(tank, direction);

    if (this.isMoveInvalid(tank)) {
      this.revertTankPosition(tank, oldX, oldY);
      tank.stepCounter--;
      this.preventScrolling = true;
    } else {
      this.updateCamera();
    }
  }

  /**
   * Saves the old position of a tank.
   * @param tank - The tank to save the position of.
   * @returns The old x and y coordinates.
   */
  private saveOldPosition(tank: Tank) {
    return { oldX: tank.sprite.x, oldY: tank.sprite.y };
  }

  /**
   * Moves a tank in a specified direction.
   * @param tank - The tank to move.
   * @param direction - The direction to move the tank.
   */
  private moveTankInDirection(tank: Tank, direction: string) {
    switch (direction) {
      case "up":
        tank.moveUp();
        break;
      case "down":
        tank.moveDown();
        break;
      case "left":
        tank.moveLeft();
        break;
      case "right":
        tank.moveRight();
        break;
    }
  }

  /**
   * Checks if the tank's move is invalid (out of bounds or colliding with an object).
   * @param tank - The tank to check.
   * @returns True if the move is invalid, otherwise false.
   */
  private isMoveInvalid(tank: Tank): boolean {
    return (
      tank.sprite.x < 0 ||
      tank.sprite.x >= 35 * 50 ||
      tank.sprite.y < 0 ||
      tank.sprite.y >= 35 * 50 ||
      this.isCollidingWithWalls(tank) ||
      this.isCollidingWithHays(tank)
    );
  }

  /**
   * Reverts a tank's position to its old coordinates.
   * @param tank - The tank to revert.
   * @param oldX - The old x-coordinate.
   * @param oldY - The old y-coordinate.
   */
  private revertTankPosition(tank: Tank, oldX: number, oldY: number) {
    tank.sprite.x = oldX;
    tank.sprite.y = oldY;
  }

  /**
   * Checks if a tank is colliding with any walls.
   * @param tank - The tank to check.
   * @returns True if colliding, otherwise false.
   */
  private isCollidingWithWalls(tank: Tank): boolean {
    return this.walls.some((wall) =>
      this.collisionManager.isColliding(tank.sprite, wall.sprite)
    );
  }

  /**
   * Checks if a tank is colliding with any hays.
   * @param tank - The tank to check.
   * @returns True if colliding, otherwise false.
   */
  private isCollidingWithHays(tank: Tank): boolean {
    return this.hays.some((hay) =>
      this.collisionManager.isColliding(tank.sprite, hay.sprite)
    );
  }

  /**
   * Updates the game state on each tick.
   */
  private update() {
    this.updateBullets();
    this.removeDestroyedHays();
  }

  /**
   * Updates the state of bullets in the game.
   */
  private updateBullets() {
    const currentTank = this.getCurrentTank();
    currentTank.bullets.forEach((bullet) => {
      if (this.handleBulletCollisions(bullet)) {
        bullet.sprite.visible = false;
        bullet.destroy();
      }
    });

    currentTank.bullets = currentTank.bullets.filter(
      (bullet) => bullet.sprite.visible
    );
  }

  /**
   * Handles collisions for a bullet.
   * @param bullet - The bullet to check.
   * @returns True if the bullet should be destroyed, otherwise false.
   */
  private handleBulletCollisions(bullet: Bullet): boolean {
    if (this.checkBulletCollisionWithHays(bullet)) {
      return true;
    }
    return this.checkBulletCollisionWithWalls(bullet);
  }

  /**
   * Checks if a bullet collides with any hays.
   * @param bullet - The bullet to check.
   * @returns True if colliding, otherwise false.
   */
  private checkBulletCollisionWithHays(bullet: Bullet): boolean {
    for (let i = 0; i < this.hays.length; i++) {
      const hay = this.hays[i];
      if (this.collisionManager.isColliding(bullet.sprite, hay.sprite)) {
        hay.takeDamage(bullet.damage);
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if a bullet collides with any walls.
   * @param bullet - The bullet to check.
   * @returns True if colliding, otherwise false.
   */
  private checkBulletCollisionWithWalls(bullet: Bullet): boolean {
    return this.walls.some((wall) =>
      this.collisionManager.isColliding(bullet.sprite, wall.sprite)
    );
  }

  /**
   * Removes destroyed hays from the game.
   */
  private removeDestroyedHays() {
    this.hays = this.hays.filter((hay) => hay.health > 0);
  }
}

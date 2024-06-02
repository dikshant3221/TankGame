export class Keyboard {
  private keys: { [key: string]: boolean } = {}; // Tracks the state of each key (pressed or not)

  constructor(game: any) {
    // Listen for keydown events and update the keys state
    window.addEventListener("keydown", (e) => this.handleKeyDown(e, game));

    // Listen for keyup events and update the keys state
    window.addEventListener("keyup", (e) => this.handleKeyUp(e));
  }

  /**
   * Handles the keydown event.
   * Prevents the default action for specific keys if scrolling is prevented.
   * Updates the state of the key to 'pressed'.
   * @param e - The keyboard event.
   * @param game - The game instance to check preventScrolling.
   */
  private handleKeyDown(e: KeyboardEvent, game: any) {
    if (this.shouldPreventScrolling(e, game)) {
      e.preventDefault();
    }
    this.keys[e.code] = true;
  }

  /**
   * Handles the keyup event.
   * Updates the state of the key to 'not pressed'.
   * @param e - The keyboard event.
   */
  private handleKeyUp(e: KeyboardEvent) {
    this.keys[e.code] = false;
  }

  /**
   * Determines if the default action for the key should be prevented.
   * @param e - The keyboard event.
   * @param game - The game instance to check preventScrolling.
   * @returns boolean - True if scrolling should be prevented, false otherwise.
   */
  private shouldPreventScrolling(e: KeyboardEvent, game: any): boolean {
    return (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code) &&
      game.preventScrolling
    );
  }

  /**
   * Adds a callback function for a specific key.
   * The callback is executed when the key is pressed.
   * @param key - The key code to listen for.
   * @param callback - The function to call when the key is pressed.
   */
  public addKey(key: string, callback: () => void) {
    window.addEventListener("keydown", (e) => this.handleKeyCallback(e, key, callback));
  }

  /**
   * Executes the callback if the specific key is pressed.
   * @param e - The keyboard event.
   * @param key - The key code to listen for.
   * @param callback - The function to call when the key is pressed.
   */
  private handleKeyCallback(e: KeyboardEvent, key: string, callback: () => void) {
    if (e.code === key) {
      callback();
    }
  }
}

# Pixi.js Tank Game

This project is a simple tank game developed using Pixi.js. It features a map with a 50 x 50 block area, where each block is 35px x 35px. The game randomly generates 25 hays and 50 walls on the map area.

## Gameplay

- Each hay has a life of 100 health. Bullets fired by tanks can destroy hays, but walls are indestructible.
- When a hay is destroyed, it disappears from the map.
- The game features three tanks: Red, Blue, and Green. Tanks can fire bullets in a straightforward direction.
- The damage of bullets is as follows:
  - Red tank: 10 damage per bullet
  - Blue tank: 20 damage per bullet
  - Green tank: 25 damage per bullet
- Red tank fires 2 bullets, Blue tank fires 3 bullets, and Green tank fires 1 bullet.
- Players can control the tank's movement and rotation using the keyboard. Tanks cannot move through walls or hays.
- Players can change the active tank during gameplay by pressing the "T" button on the keyboard.

## Installation

1. **Clone the repository:**
git clone git@github.com/your-repository.git
2. **Navigate to the project directory:**
cd pixijs-tank-game
3.**Install dependencies**
npm install
3. **Run the game:**
npm run start


#How to Play

**Start the Game:**
Upon opening the game in your browser, you'll be presented with the game screen.
Set the screen scale ratio to 100%
Drag the game screen to top left corner
Here you find yout tank at its initial position
Then use the arrow keys to move the tank and the space bar to fire bullets.

**Tank Controls:**
Use the arrow keys (up, down, left, right) to move the tank in different directions.
Press the space bar to fire bullets in the direction the tank is facing.

**Obstacles:**
Navigate around walls and hay bales to avoid collisions.
Destroy hay bales by firing bullets at them. Each hay bale has 100 health.

**Tank Switching:**
Switch between tanks during gameplay by pressing the "T" key on your keyboard.
Each tank has different firing capabilities and bullet damage.

**Game Over:**
The game ends when all tanks are destroyed.
Have fun and enjoy the game!

## License

This project is licensed under the MIT License.
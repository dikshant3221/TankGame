import * as PIXI from 'pixi.js';
import { Game } from './Game';

const app = new PIXI.Application({
  width: 1750,
  height: 1750,
  backgroundColor: 0x1099bb,
});

document.body.appendChild(app.view);

const game = new Game(app);
game.start();

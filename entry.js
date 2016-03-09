
var Game = require('./lib/game.js');
var GameView = require('./lib/gameView.js');
var Util = require('./lib/util.js');
var PlayerCell = require('./lib/playerCell.js');
var EnemyCell = require('./lib/enemyCell.js');
var MovingObject = require('./lib/movingObject.js');

document.body.style.cursor='crosshair';

var canvasEl = document.getElementsByTagName("canvas")[0];
canvasEl.width = window.innerWidth;
canvasEl.height = window.innerHeight;
var ctx = canvasEl.getContext("2d");

var game = new Game();
var gameView = new GameView(game, ctx);
gameView.start();

document.onkeypress = function(event) {
  if (event.code === "Space") {
    location.reload();
  }
};

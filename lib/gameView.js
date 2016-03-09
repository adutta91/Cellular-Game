
var Game = require('./game.js');

window.MOUSE_POS = [];

document.onmousemove = function(event) {
  window.MOUSE_POS = [event.clientX, event.clientY];
};

var GameView = function(game, ctx) {
  this.game = game;
  this.ctx = ctx;
  this.game.addPlayerCell();
  this.game.addRivalCell(this.game);
};

GameView.prototype.start = function() {
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function() {
  if (!this.game.gameOver) {
    this.game.draw(this.ctx);
    requestAnimationFrame(this.animate.bind(this));
  } else {
    alert("Game Over!");
  }
};



module.exports = GameView;

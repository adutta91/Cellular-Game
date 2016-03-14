
var Game = require('./game.js');

window.MOUSE_POS = [];

document.onmousemove = function(event) {
  window.MOUSE_POS = [event.clientX, event.clientY];
};

var GameView = function(game, ctx) {
  this.game = game;
  this.ctx = ctx;
  this.game.addPlayerCell(ctx);
  setTimeout(game.addRivalCell.bind(game), 5000);
};


GameView.prototype.welcome = function() {
  this.ctx.clearRect(0, 0, DIM_X, DIM_Y);

  this.displayMessage();
};

GameView.prototype.displayMessage = function() {
  var xPos = (DIM_X/2);
  var yPos = (DIM_Y/2);

  this.ctx.fillStyle = "#FFFFFF";
  this.ctx.textBaseline="center";
  this.ctx.textAlign="center";

  this.ctx.font="24px Inconsolata";
  this.ctx.fillText("Press 'Space' to start the game, press 'R' to restart at anytime",
                   xPos, yPos - 70);

  this.ctx.font="20px Inconsolata";
  this.ctx.fillText("Instructions below",
                   xPos, yPos + 30);
}

GameView.prototype.end = function() {
  var xPos = (DIM_X/2);
  var yPos = (DIM_Y/2);

  this.ctx.fillStyle = "#FFFFFF";
  this.ctx.textBaseline="center";
  this.ctx.textAlign="center";

  this.ctx.font="24px Inconsolata";
  this.ctx.fillText("Game Over!!!",
                   xPos, yPos - 70);

  this.ctx.font="20px Inconsolata";
  this.ctx.fillText("You Lost!",
                   xPos, yPos + 30);
}

GameView.prototype.win = function() {
  var xPos = (DIM_X/2);
  var yPos = (DIM_Y/2);

  this.ctx.fillStyle = "#FFFFFF";
  this.ctx.textBaseline="center";
  this.ctx.textAlign="center";

  this.ctx.font="24px Inconsolata";
  this.ctx.fillText("You Won!!",
                   xPos, yPos - 70);

  this.ctx.font="20px Inconsolata";
  this.ctx.fillText("Press 'R' to play again",
                   xPos, yPos + 30);
}

GameView.prototype.start = function() {
  this.ctx.clearRect(0, 0, DIM_X, DIM_Y);

  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function() {
  if (!this.game.gameOver && !this.game.playerWins) {
    this.game.draw(this.ctx);
    requestAnimationFrame(this.animate.bind(this));
  } else if (this.game.gameOver) {
    this.end();
  } else {
    this.win();
  }
};

module.exports = GameView;

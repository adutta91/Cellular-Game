
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
  this.ctx.fillStyle = "#000000";
  this.ctx.fillRect(0, 0, DIM_X, DIM_Y);

  this.displayMessage();
};

GameView.prototype.displayMessage = function() {
  var xPos = (DIM_X/2);
  var yPos = (DIM_Y/2);

  this.ctx.strokeStyle = "#C9C9C9";
  this.ctx.fillStyle = "#FFFFFF";


  this.ctx.textBaseline="center";
  this.ctx.textAlign="center";
  this.ctx.font="24px Inconsolata";
  this.ctx.fillText("Cellular", xPos, yPos - 70);
  this.ctx.font="16px Inconsolata";
  this.ctx.fillText("Guide your cell with the mouse cursor to eat the other cells!",
                   xPos, yPos - 30);
  this.ctx.fillText("But watch out for your rival!",
                   xPos, yPos);
  this.ctx.fillText("You lose a life each time you're eaten. You only have 3, as does your rival",
                   xPos, yPos + 30);
  this.ctx.fillText("The larger cells well eat you too if you get too close, so be careful!",
                   xPos, yPos + 60);
  this.ctx.fillText("Press 'Space' to start the game, press 'R' to restart at anytime",
                   xPos, yPos + 110);
}

GameView.prototype.end = function() {
  this.ctx.clearRect(0, 0, DIM_X, DIM_Y);
  this.ctx.fillStyle = "#000000";
  this.ctx.fillRect(0, 0, DIM_X, DIM_Y);

  var xPos = (DIM_X/2);
  var yPos = (DIM_Y/2);
  this.ctx.fillStyle = "#C9C9C9";

  this.ctx.textBaseline="center";
  this.ctx.textAlign="center";

  this.ctx.font="24px Inconsolata";
  this.ctx.fillText("GAME OVER!", xPos, yPos - 70);

  this.ctx.font="16px Inconsolata";
  this.ctx.fillText("You lost!",
                   xPos, yPos - 30);
  this.ctx.fillText("Press 'R' to play again!",
                   xPos, yPos + 30);
}

GameView.prototype.win = function() {
  this.ctx.clearRect(0, 0, DIM_X, DIM_Y);
  this.ctx.fillStyle = "#000000";
  this.ctx.fillRect(0, 0, DIM_X, DIM_Y);

  var xPos = (DIM_X/2);
  var yPos = (DIM_Y/2);
  this.ctx.fillStyle = "#C9C9C9";

  this.ctx.textBaseline="center";
  this.ctx.textAlign="center";

  this.ctx.font="24px Inconsolata";
  this.ctx.fillText("YOU WIN!", xPos, yPos - 70);

  this.ctx.font="16px Inconsolata";
  this.ctx.fillText("Press 'R' to play again!",
                   xPos, yPos + 30);
}

GameView.prototype.start = function() {
  this.ctx.clearRect(0, 0, DIM_X, DIM_Y);
  this.ctx.fillStyle = "#000000";
  this.ctx.fillRect(0, 0, DIM_X, DIM_Y);

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

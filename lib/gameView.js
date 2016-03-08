

window.MOUSE_POS = [];

document.onmousemove = function(event) {
  window.MOUSE_POS = [event.clientX, event.clientY];
};

var GameView = function(game, ctx) {
  this.game = game;
  this.ctx = ctx;
  this.game.addPlayerCell();
};

GameView.prototype.start = function() {
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function() {
  this.game.draw(this.ctx);
  requestAnimationFrame(this.animate.bind(this));
};


module.exports = GameView;

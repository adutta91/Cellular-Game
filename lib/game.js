
var PlayerCell = require('./playerCell.js');
var EnemyCell = require('./enemyCell.js');

var DIM_X = window.innerWidth;
var DIM_Y = window.innerHeight;

var Game = function () {
  this.enemyCells = [];
  this.playerCell = {};
};

Game.prototype.add = function (object) {
  if (object instanceof PlayerCell) {
    this.playerCell = object;
  } else if (object instanceof EnemyCell) {
    this.enemyCells.push(object);
  } else {
    throw 'hell';
  }
};

Game.prototype.addPlayerCell = function() {
  var playerCell = new PlayerCell({
    pos: [DIM_X/2, DIM_Y/2]
  });
  this.add(playerCell);

  this.add(createEnemyCell());

  return playerCell;
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, DIM_X, DIM_Y);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, DIM_X, DIM_Y);

  this.playerCell.vel = this.findVel(this.playerCell.pos);
  this.playerCell.move();
  this.playerCell.draw(ctx);
  this.enemyCells.forEach(function(cell) {
    cell.draw(ctx);
  });
};

Game.prototype.findVel = function(pos, that) {
  if (!window.MOUSE_POS[0]) {
    return [0,0];
  }
  var buffer = this.playerCell.radius * 2;

  var diffX = (window.MOUSE_POS[0] - pos[0])/(this.playerCell.radius * 2);
  var diffY = (window.MOUSE_POS[1] - pos[1])/(this.playerCell.radius * 2);
  return [(diffX), (diffY)];
};

var createEnemyCell = function() {
  var enemyCell = new EnemyCell({
    pos: [150, 150],
    vel: [0, 0]
  });
  return enemyCell
};

module.exports = Game;

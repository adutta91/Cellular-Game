var Util = require('./util.js');

var PlayerCell = require('./playerCell.js');
var RivalCell = require('./rivalCell.js');
var EnemyCell = require('./enemyCell.js');

DIM_X = window.innerWidth;
DIM_Y = window.innerHeight;

var Game = function () {
  this.enemyCells = [];
  this.playerCell = {};
  this.rivalCell = {};
  this.points = 0;
  this.gameOver = false;
};

Game.prototype.add = function (object) {
  if (object instanceof PlayerCell) {
    this.playerCell = object;
  } else if (object instanceof EnemyCell) {
    this.enemyCells.push(object);
  } else if (object instanceof RivalCell) {
    this.rivalCell = object;
  } else {
    throw 'hell';
  }
};

Game.prototype.addPlayerCell = function() {
  var playerCell = new PlayerCell({
    pos: [100, DIM_Y/2]
  });
  this.add(playerCell);
};

Game.prototype.addRivalCell = function() {
  var rivalCell = new RivalCell({
    pos: [DIM_X - 100, DIM_Y/2]
  });
  this.add(rivalCell);
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, DIM_X, DIM_Y);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, DIM_X, DIM_Y);

  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.fillText(this.points,10,50);

  this.playerCell.vel = this.findVel(this.playerCell.pos);
  this.playerCell.move();

  this.playerCell.draw(ctx);
  this.rivalCell.draw(ctx);

  this.checkCollisions();
  this.checkEnemies();
  this.moveEnemies();
  this.enemyCells.forEach(function(cell) {
    cell.draw(ctx);
  });
};

Game.prototype.moveEnemies = function() {
  this.enemyCells.forEach(function(cell) {
    cell.move();
  });
};

Game.prototype.checkCollisions = function() {
  var player = this.playerCell
  this.enemyCells.forEach(function(cell) {
    if (cell.hasCollidedWith(player)) {
      this.handleCollision(player, cell);
    }
  }.bind(this));
};

Game.prototype.handleCollision = function(player, enemy) {
  if (player.radius > enemy.radius) {
    this.consume(player, enemy);
  } else if (enemy.radius >= player.radius) {
    // this.gameOver = true;
    alert('GAME OVER');
  }
};

Game.prototype.checkEnemies = function() {
  var numEnemies = Math.floor(this.playerCell.radius / 5)
  if (numEnemies < 5) { numEnemies = 5 };
  if (numEnemies > 15) { numEnemies = 10 };
  while (this.enemyCells.length < numEnemies) {
    this.add(this.createEnemyCell());
  }
};

Game.prototype.consume = function(player, enemy) {
  var growth = (enemy.radius / 4);
  var idx = this.enemyCells.indexOf(enemy);
  this.enemyCells.splice(idx, 1);
  player.radius += growth;
  this.points += Math.floor(growth);
  console.log(this.points);
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

Game.prototype.createEnemyCell = function() {
  var pos = Util.randomPos();
  var radius = Util.randomSize(this.playerCell.radius);
  var vel = Util.findVel(radius);

  var enemyCell = new EnemyCell({
    pos: pos,
    vel: vel,
    radius: radius
  });
  return enemyCell
};

Game.prototype.clear = function(ctx) {
  ctx.clearRect(0, 0, DIM_X, DIM_Y);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, DIM_X, DIM_Y);
};

module.exports = Game;

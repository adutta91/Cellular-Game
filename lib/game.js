var Util = require('./util.js');

var PlayerCell = require('./playerCell.js');
var RivalCell = require('./rivalCell.js');
var EnemyCell = require('./enemyCell.js');

DIM_X = window.innerWidth;
DIM_Y = window.innerHeight;

var Game = function () {
  this.enemyCells = [];
  this.playerCell = {};
  this.rivalCell = null;
  this.points = 0;
  this.gameOver = false;
  this.playerWins = false;
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

Game.prototype.addPlayerCell = function(ctx) {
  var playerCell = new PlayerCell({
    pos: [DIM_X/2, DIM_Y/2],
    lives: 3
  });
  this.add(playerCell);
};

Game.prototype.resetPlayer = function() {
  this.checkGameStatus(this.playerCell.lives, this.rivalCell.lives)
  var lives = this.playerCell.lives;
  this.playerCell = null;
  var newPlayer = new PlayerCell({
    pos: [100, DIM_Y/2],
    lives: lives
  });
  setTimeout(function() {
    this.add(newPlayer);
  }.bind(this), 2000);
};

Game.prototype.addRivalCell = function() {
  var rivalCell = new RivalCell({
    pos: [DIM_X - 100, DIM_Y/2],
    vel: [0, 0],
    radius: this.playerCell.radius - 2,
    lives: 3
  });
  this.add(rivalCell);
};

Game.prototype.resetRival = function() {
  this.checkGameStatus(this.playerCell.lives, this.rivalCell.lives)
  var lives = this.rivalCell.lives;
  this.rivalCell = null;
  var newRival = new RivalCell({
    pos: [DIM_X - 100, DIM_Y/2],
    vel: [0, 0],
    radius: this.playerCell.radius - 2,
    lives: lives
  });
  setTimeout(function() {
    this.add(newRival);
  }.bind(this), 2000);
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, DIM_X, DIM_Y);
  ctx.fillStyle = "#C9C9C9";
  ctx.fillRect(0, 0, DIM_X, DIM_Y);

  this.checkCollisions();
  this.checkEnemies();
  this.moveEnemies();
  this.enemyCells.forEach(function(cell) {
    cell.draw(ctx);
  });

  this.drawPoints(ctx);
  this.moveMainCells(ctx);
};

Game.prototype.drawPoints = function(ctx) {
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.fillText(this.points, 20, 50);
};

Game.prototype.moveMainCells = function(ctx) {
  if (this.playerCell) {
    this.playerCell.vel = this.findVel(this.playerCell.pos);
    this.playerCell.move();
    this.playerCell.draw(ctx);
  }
  if (this.rivalCell) {
    if (this.playerCell) {
      if (this.playerCell.radius < this.rivalCell.radius) {
        this.rivalCell.follow(this.playerCell.pos, (this.rivalCell.radius * 4));
      } else {
        var newPos = Util.findSmallerPos(this.rivalCell.radius, this.enemyCells);
        this.rivalCell.follow(newPos, (this.rivalCell.radius * 3));
      }
    } else {
      var newPos = Util.findSmallerPos(this.rivalCell.radius, this.enemyCells);
      this.rivalCell.follow(newPos, (this.rivalCell.radius * 3));
    }
    this.rivalCell.draw(ctx);
  }
};

Game.prototype.findVel = function(pos) {
  if (!window.MOUSE_POS[0]) {
    return [0,0];
  }
  var buffer = this.playerCell.radius;

  var distance = Util.distance(pos, window.MOUSE_POS);

  var diffX = (window.MOUSE_POS[0] - pos[0])/buffer;
  var diffY = (window.MOUSE_POS[1] - pos[1])/buffer;

  return [(diffX), (diffY)];
};

Game.prototype.moveEnemies = function() {
  var player = {radius: 14, pos: undefined}
  if (this.playerCell) {
    player = this.playerCell;
  }
  var rival = this.rivalCell;
  if (rival === null) { rival = {} };
  this.enemyCells.forEach(function(cell) {
    if (cell.radius < player.radius && cell.radius < rival.radius) {
      cell.avoid(player.pos, rival.pos);
    } else if (cell.radius < player.radius) {
      cell.avoid(player.pos);
    } else if (cell.radius < rival.radius) {
      cell.avoid(rival.pos);
    } else {
      cell.wander();
    }
  });
};

Game.prototype.checkCollisions = function() {
  var player = this.playerCell
  var rival = this.rivalCell

  if (player && player.hasCollidedWith(rival)) {
    if (player.radius > rival.radius) {
      this.consume(player, rival);
      this.rivalCell.lives -= 1;
      this.resetRival();
    } else {
      this.consume(rival, player);
      this.playerCell.lives -= 1
      this.resetPlayer();
    }
  }
  this.enemyCells.forEach(function(cell) {
    if (cell.hasCollidedWith(player)) {
      this.handleCollision(player, cell);
    } else if (cell.hasCollidedWith(rival) && cell.radius < rival.radius) {
      this.consume(rival, cell);
    }
  }.bind(this));
};

Game.prototype.checkGameStatus = function(playerLives, rivalLives) {
  if (rivalLives === 0) {
    this.playerWins = true;
  } else if (playerLives === 0) {
    this.gameOver = true;
  }
};

Game.prototype.handleCollision = function(player, enemy) {
  if (player.radius > enemy.radius) {
    this.consume(player, enemy);
  } else if (enemy.radius >= player.radius) {
    this.gameOver = true;
  }
};

Game.prototype.checkEnemies = function() {
  var radius = 10;
  if (this.playerCell) {
    radius = this.playerCell.radius;
  }
  var numEnemies = Math.floor(radius / 5);

  this.enemyCells.forEach(function(cell) {
    if ((cell.pos[0] < 0 || cell.pos[0] > DIM_X) || (cell.pos[1] < 0 || cell.pos[1] > DIM_Y)) {
      cell.pos = Util.randomPos();
    }
  });

  if (numEnemies < 5) { numEnemies = 5 };
  if (numEnemies > 10) { numEnemies = 10 };

  while (this.enemyCells.length < numEnemies) {
    this.add(this.createEnemyCell());
  }
};

Game.prototype.consume = function(larger, smaller) {
  var growth = (smaller.radius / 10);
  if (smaller instanceof EnemyCell) {
    var idx = this.enemyCells.indexOf(smaller);
    this.enemyCells.splice(idx, 1);
  }
  larger.radius += growth;

  if (larger instanceof PlayerCell) {
    this.points += Math.floor(growth);
  }

};

Game.prototype.createEnemyCell = function() {
  var pos = Util.randomPos();
  var radius = 10;

  if (this.playerCell) {
    radius = Util.randomSize(this.playerCell.radius);
  }
  if (!Util.smallEnemiesExist(radius, this.enemyCells)) {
    radius = 10;
  }

  var vel = Util.findVel(radius);

  var enemyCell = new EnemyCell({
    pos: pos,
    vel: vel,
    radius: radius
  });

  return enemyCell
};

module.exports = Game;

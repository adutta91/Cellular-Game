/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(7);
	var Util = __webpack_require__(2);
	var PlayerCell = __webpack_require__(3);
	var EnemyCell = __webpack_require__(6);
	var MovingObject = __webpack_require__(4);

	document.body.style.cursor='crosshair';

	var canvasEl = document.getElementsByTagName("canvas")[0];
	canvasEl.width = window.innerWidth;
	canvasEl.height = window.innerHeight;
	var ctx = canvasEl.getContext("2d");

	var game = new Game();
	var gameView = new GameView(game, ctx);
	gameView.welcome();

	document.onkeypress = function(event) {
	  if (event.code === "KeyR") {
	    location.reload();
	  }
	  if (event.code === "Space") {
	    gameView.start();
	  }
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(2);

	var PlayerCell = __webpack_require__(3);
	var RivalCell = __webpack_require__(5);
	var EnemyCell = __webpack_require__(6);

	DIM_X = window.innerWidth;
	DIM_Y = window.innerHeight;

	var Game = function () {
	  this.enemyCells = [];
	  this.playerCell = {};
	  this.rivalCell = null;

	  this.playerLives = 3;
	  this.rivalLives = 3;

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
	  this.checkGameStatus(this.playerLives, this.rivalLives);
	  this.playerCell = null;

	  var radius = 15;

	  if (this.rivalCell) {
	    radius = this.rivalCell.radius;
	  }

	  var newPlayer = new PlayerCell({
	    pos: [DIM_X/2, DIM_Y/2],
	    radius: radius
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
	  this.checkGameStatus(this.playerLives, this.rivalLives);
	  this.rivalCell = null;

	  var radius = 15;

	  if (this.playerCell) {
	    radius = this.playerCell.radius - 1;
	  }

	  var newRival = new RivalCell({
	    pos: [DIM_X - 100, DIM_Y/2],
	    vel: [0, 0],
	    radius: radius
	  });
	  setTimeout(function() {
	    this.add(newRival);
	  }.bind(this), 2000);
	};

	Game.prototype.draw = function(ctx) {
	  ctx.clearRect(0, 0, DIM_X, DIM_Y);

	  this.drawPlayerLives(ctx);
	  this.drawRivalLives(ctx);

	  this.checkCollisions();
	  this.checkEnemies();
	  this.moveEnemies();
	  this.enemyCells.forEach(function(cell) {
	    cell.draw(ctx);
	  });

	  this.moveMainCells(ctx);
	};

	Game.prototype.drawPlayerLives = function(ctx) {
	  ctx.fillStyle = "#9ED2A5";
	  ctx.strokeStyle = "#000000";
	  var xPos = 40;
	  for (var i = 0; i < this.playerLives; i++) {
	    ctx.beginPath();
	    ctx.arc(
	      (xPos + i * 30), 30, 10, 0, 2 * Math.PI, true
	    );
	    ctx.stroke();
	    ctx.fill();
	  }
	};

	Game.prototype.drawRivalLives = function(ctx) {
	  ctx.fillStyle = "#E29797";
	  ctx.strokeStyle = "#000000";
	  var xPos = DIM_X - 40;
	  for (var i = 0; i < this.rivalLives; i++) {
	    ctx.beginPath();
	    ctx.arc(
	      (xPos - i*30), 30, 10, 0, 2 * Math.PI, true
	    );
	    ctx.stroke();
	    ctx.fill();
	  }
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
	      this.rivalLives -= 1;
	      this.resetRival();
	    } else {
	      this.consume(rival, player);
	      this.playerLives -= 1;
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
	    this.playerLives -= 1;
	    this.resetPlayer();
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
	};

	Game.prototype.createEnemyCell = function() {
	  var pos = Util.randomPos();
	  var radius = 10;

	  if (this.playerCell) {
	    radius = Util.randomSize(this.playerCell.radius);
	  }
	  var smallerRad = this.findSmallerRadius();

	  if (!Util.smallEnemiesExist(smallerRad, this.enemyCells)) {
	    radius = Util.getRandomInRange(10, smallerRad);
	  }

	  var vel = Util.findVel(radius);

	  var enemyCell = new EnemyCell({
	    pos: pos,
	    vel: vel,
	    radius: radius
	  });

	  return enemyCell
	};

	Game.prototype.findSmallerRadius = function() {
	  var rad;

	  var player = this.playerCell;
	  var rival = this.rivalCell;

	  if (player && rival) {
	    rad = ((player.radius < rival.radius) ? player.radius : rival.radius)
	  } else if (player) {
	    rad = player.radius;
	  } else {
	    rad = rival.radius
	  }

	  return rad;
	};

	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports) {

	
	var Util = function() { };

	var VEL_TRANSFORMS = {
	  1: [1, 1],
	  2: [1, -1],
	  3: [-1, 1],
	  4: [-1, -1]
	};

	Util.inherits = function(child, base) {
	  function Surrogate () { this.constructor = child };
	  Surrogate.prototype = base.prototype;
	  child.prototype = new Surrogate();
	};

	Util.distance = function(pos1, pos2) {
	  if (pos1 && pos2) {
	    var distX = pos1[0] - pos2[0];
	    var distY = pos1[1] - pos2[1];
	    var distance = Math.sqrt((distX * distX) + (distY * distY));
	    return distance;
	  }
	};

	Util.randomPos = function() {
	  return [this.getRandomInRange(0, DIM_X), this.getRandomInRange(0, DIM_Y)];
	};

	Util.randomSize = function(playerRadius) {
	  var size = this.getRandomInRange(5, (playerRadius + 25));
	  return size;
	};

	Util.findVel = function(radius) {
	  var vector = VEL_TRANSFORMS[this.getRandomInRange(1, 4)];
	  var initial = [(vector[0] * Math.random())*10, (vector[1] * Math.random())*10];
	  return [initial[0]/(radius/6), initial[1]/(radius/6)];
	};

	Util.smallEnemiesExist = function(playerRadius, enemies) {
	  var result = false;
	  enemies.forEach(function(cell) {
	    if ((playerRadius - cell.radius) > 5) {
	      result = true;
	    }
	  });
	  return result;
	};

	Util.findSmallerPos = function(radius, enemies) {
	  var enemy = {};
	  enemies.forEach(function(cell) {
	    if (cell.radius < radius) {
	      enemy = cell;
	    }
	  });

	  return enemy.pos;
	};

	Util.getRandomInRange = function(min, max) {
	  return (Math.floor(Math.random() * (max - min + 1)) + min);
	};

	module.exports = Util;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(4);
	var Util = __webpack_require__(2);

	var PlayerCell = function(options) {
	  options.pos = options.pos;
	  options.vel = options.vel || [0, 0];
	  options.radius = options.radius || 15;
	  options.color = options.color || "#4FB34F";


	  MovingObject.call(this, options);
	}


	Util.inherits(PlayerCell, MovingObject);

	module.exports = PlayerCell;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(2);

	var MovingObject = function (options) {
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.radius = options.radius;
	  this.color = options.color;
	};

	MovingObject.prototype.draw = function(ctx) {
	  ctx.fillStyle = this.color;
	  ctx.strokeStyle = "#000000";
	  ctx.lineWidth = 3;

	  ctx.beginPath();
	  ctx.arc(
	    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	  );
	  ctx.stroke();
	  ctx.fill();
	};

	MovingObject.prototype.move = function() {

	  var newPos = [];
	  newPos[0] = this.pos[0] += this.vel[0];
	  newPos[1] = this.pos[1] += this.vel[1];

	  if (newPos[0] > DIM_X || newPos[0] < 0) {
	    this.vel[0] = this.vel[0] * -1
	    newPos[0] = this.pos[0] += this.vel[0];
	  } else if (newPos[1] > DIM_Y || newPos[1] < 0) {
	    this.vel[1] = this.vel[1] * -1
	    newPos[1] = this.pos[1] += this.vel[1];
	  }

	  this.pos = newPos;
	};

	MovingObject.prototype.hasCollidedWith = function(otherObject) {
	  if (otherObject === null) { return false }
	  var distance = Util.distance(this.pos, otherObject.pos);
	  if (distance < (this.radius + otherObject.radius)) {
	    return true;
	  } else {
	    return false;
	  }
	};


	module.exports = MovingObject;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(4);
	var Util = __webpack_require__(2);

	var RivalCell = function(options) {
	  options.pos = options.pos;
	  options.vel = options.vel || [0, 0];
	  options.radius = options.radius || 20;
	  options.color = "#CA4343";

	  this.follow = follow;
	  this.seek = seek;

	  MovingObject.call(this, options);
	}

	var follow = function(pos, buffer) {
	  var vel = findVel(this.pos, pos, this.radius, buffer);
	  this.vel = vel;
	  if (typeof this.vel === "undefined") { vel = [0,0] }
	  this.move();
	};

	var seek = function(pos) {
	  this.vel = [(pos[0] - this.pos[0]), (pos[1] - this.pos[1])];
	  this.move();
	};

	var findVel = function(pos1, pos2, radius, buffer) {
	  if (pos1 === undefined || pos2 === undefined) {
	    return;
	  }

	  var distX = pos2[0] - pos1[0];
	  var distY = pos2[1] - pos1[1];

	  var leadX = distX > 0 ? 100 : -100
	  var leadY = distY > 0 ? 100 : -100

	  var diffX = (distX + leadX)/buffer;
	  var diffY = (distY + leadY)/buffer;
	  return [(diffX), (diffY)];
	};


	Util.inherits(RivalCell, MovingObject);

	module.exports = RivalCell;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(2);
	var MovingObject = __webpack_require__(4);

	var EnemyCell = function(options) {
	  options.pos = options.pos;
	  options.vel = options.vel || [0, 0];
	  options.radius = options.radius;
	  options.color = "#058F98";

	  this.avoid = avoid;
	  this.wander = wander;
	  this.wanderingInterval = null;

	  MovingObject.call(this, options);
	};


	var avoid = function(player, rival) {
	  clearInterval(this.wanderingInterval);
	  var target = player;
	  if (rival) {
	    var rivalDist = Util.distance(this.pos, rival);
	    var playerDist = Util.distance(this.pos, player);
	    if (rivalDist < playerDist) { target = rival };
	  }
	  if (Util.distance(this.pos, target) < 100) {
	    this.vel = findVel(this.pos, target, this.radius);
	  }
	  this.move();
	};

	var wander = function() {

	  // this.wanderingInterval = setInterval(3000, changeVel.bind(this));

	  this.move();
	};

	var changeVel = function() {
	  var velX = Util.getRandomInRange(20, 100)/(this.radius);
	  var velY = Util.getRandomInRange(20, 100)/(this.radius);

	  this.vel = [Util.getRandomInRange(0, 5), Util.getRandomInRange(0, 5)]
	};

	var findVel = function(pos1, pos2, radius) {

	  var buffer = radius * 4

	  var diffX = (pos1[0] - pos2[0])/buffer;
	  var diffY = (pos1[1] - pos2[1])/buffer;
	  return [(diffX), (diffY)];
	};



	Util.inherits(EnemyCell, MovingObject);

	module.exports = EnemyCell;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	
	var Game = __webpack_require__(1);

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


/***/ }
/******/ ]);
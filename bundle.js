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
	var GameView = __webpack_require__(6);
	var Util = __webpack_require__(4);
	var PlayerCell = __webpack_require__(2);
	var EnemyCell = __webpack_require__(5);
	var MovingObject = __webpack_require__(3);

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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);

	var PlayerCell = __webpack_require__(2);
	var RivalCell = __webpack_require__(7);
	var EnemyCell = __webpack_require__(5);

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
	  this.playerCell.vel = this.findVel(this.playerCell.pos);
	  this.playerCell.move();
	  this.playerCell.draw(ctx);

	  this.rivalCell.follow(this.playerCell.pos);
	  this.rivalCell.draw(ctx);
	};

	Game.prototype.findVel = function(pos) {
	  if (!window.MOUSE_POS[0]) {
	    return [0,0];
	  }
	  var buffer = this.playerCell.radius * 2;

	  var diffX = (window.MOUSE_POS[0] - pos[0])/(this.playerCell.radius * 2);
	  var diffY = (window.MOUSE_POS[1] - pos[1])/(this.playerCell.radius * 2);
	  return [(diffX), (diffY)];
	};

	Game.prototype.moveEnemies = function() {
	  this.enemyCells.forEach(function(cell) {
	    cell.move();
	  });
	};

	Game.prototype.checkCollisions = function() {
	  var player = this.playerCell
	  if (player.hasCollidedWith(this.rivalCell)) {
	    this.gameOver = true;
	  }
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
	    this.gameOver = true;
	  }
	};

	Game.prototype.checkEnemies = function() {
	  var numEnemies = Math.floor(this.playerCell.radius / 5)

	  if (numEnemies < 5) { numEnemies = 5 };
	  if (numEnemies > 10) { numEnemies = 10 };

	  while (this.enemyCells.length < numEnemies) {
	    this.add(this.createEnemyCell());
	  }

	  Util.ensureSmallEnemies(this.playerCell.radius, this.enemyCells);
	};

	Game.prototype.consume = function(player, enemy) {
	  var growth = (enemy.radius / 4);
	  var idx = this.enemyCells.indexOf(enemy);
	  this.enemyCells.splice(idx, 1);
	  player.radius += growth;
	  this.rivalCell.radius = player.radius + 1;
	  this.points += Math.floor(growth);
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

	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(3);
	var Util = __webpack_require__(4);

	var PlayerCell = function(options) {
	  options.pos = options.pos;
	  options.vel = options.vel || [0, 0];
	  options.radius = 15;
	  options.color = "#FFFFFF";

	  MovingObject.call(this, options);
	}


	Util.inherits(PlayerCell, MovingObject);

	module.exports = PlayerCell;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);

	var MovingObject = function (options) {
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.radius = options.radius;
	  this.color = options.color;
	};

	MovingObject.prototype.draw = function(ctx) {
	  ctx.fillStyle = this.color;

	  ctx.beginPath();
	  ctx.arc(
	    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	  );
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
	  var distance = Util.distance(this.pos, otherObject.pos);

	  if (distance < this.radius || distance < otherObject.radius) {
	    return true;
	  } else {
	    return false;
	  }
	};


	module.exports = MovingObject;


/***/ },
/* 4 */
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
	  var distX = pos1[0] - pos2[0];
	  var distY = pos1[1] - pos2[1];
	  var distance = Math.sqrt((distX * distX) + (distY * distY));
	  return distance;
	};

	Util.randomPos = function() {
	  return [getRandomInRange(0, DIM_X), getRandomInRange(0, DIM_Y)];
	};

	Util.randomSize = function(playerRadius) {
	  var size = getRandomInRange(5, (playerRadius + 25));
	  return size;
	};

	Util.findVel = function(radius) {
	  var vector = VEL_TRANSFORMS[getRandomInRange(1, 4)];
	  var initial = [(vector[0] * Math.random())*10, (vector[1] * Math.random())*10];
	  return [initial[0]/(radius/6), initial[1]/(radius/6)];
	};

	Util.ensureSmallEnemies = function(playerRadius, enemies) {
	  var count = 0;
	  enemies.forEach(function(cell) {
	    if (cell.radius < playerRadius) {
	      count += 1;
	    }
	  });
	  if (count === 0) {
	    enemies[getRandomInRange(0, enemies.length)].radius = 10;
	  }
	};

	var getRandomInRange = function(min, max) {
	  return (Math.floor(Math.random() * (max - min + 1)) + min);
	};

	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
	var MovingObject = __webpack_require__(3);

	var EnemyCell = function(options) {
	  options.pos = options.pos;
	  options.vel = options.vel || [0, 0];
	  options.radius = options.radius;
	  options.color = "#00F";

	  MovingObject.call(this, options);
	};


	Util.inherits(EnemyCell, MovingObject);

	module.exports = EnemyCell;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	
	var Game = __webpack_require__(1);

	window.MOUSE_POS = [];

	document.onmousemove = function(event) {
	  window.MOUSE_POS = [event.clientX, event.clientY];
	};

	var GameView = function(game, ctx) {
	  this.game = game;
	  this.ctx = ctx;
	  this.game.addPlayerCell();
	  this.game.addRivalCell();
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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(3);
	var Util = __webpack_require__(4);

	var RivalCell = function(options) {
	  options.pos = options.pos;
	  options.vel = options.vel || [0, 0];
	  options.radius = 15;
	  options.color = "#F00";

	  this.follow = follow;

	  MovingObject.call(this, options);
	}

	var follow = function(pos) {
	  this.vel = findVel(this.pos, pos, this.radius);
	  this.move();
	};

	var findVel = function(pos1, pos2, radius) {
	  var diffX = (pos2[0] - pos1[0])/(radius * 4);
	  var diffY = (pos2[1] - pos1[1])/(radius * 4);
	  return [(diffX), (diffY)];
	};


	Util.inherits(RivalCell, MovingObject);

	module.exports = RivalCell;


/***/ }
/******/ ]);
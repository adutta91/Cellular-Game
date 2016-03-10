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
	var GameView = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./lib/gameView.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
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
	var RivalCell = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./rivalCell.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	var EnemyCell = __webpack_require__(6);

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
	    pos: [DIM_X - 100, DIM_Y/2],
	    vel: [0, 0],
	    radius: this.playerCell.radius + 5
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
	  if (this.rivalCell !== null) {
	    if (this.playerCell.radius < this.rivalCell.radius) {
	      this.rivalCell.follow(this.playerCell.pos, (this.rivalCell.radius * 4));
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
	  var player = this.playerCell;
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
	  if (player.hasCollidedWith(rival)) {
	    if (player.radius > rival.radius) {
	      this.consume(player, rival);
	      this.rivalCell = null;
	      setTimeout(this.addRivalCell.bind(this), 10000);
	      this.points += 50;
	    } else {
	      this.gameOver = true;
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

	Game.prototype.handleCollision = function(player, enemy) {
	  if (player.radius > enemy.radius) {
	    this.consume(player, enemy);
	  } else if (enemy.radius >= player.radius) {
	    this.gameOver = true;
	  }
	};

	Game.prototype.checkEnemies = function() {
	  var numEnemies = Math.floor(this.playerCell.radius / 5)

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
	  var radius = Util.randomSize(this.playerCell.radius);
	  var vel = Util.findVel(radius);

	  if (!Util.smallEnemiesExist(this.playerCell.radius, this.enemyCells)) {
	    radius = 10;
	  }

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
	    if (cell.radius < playerRadius) {
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
	  options.radius = 15;
	  options.color = "#4FB34F";

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
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(2);
	var MovingObject = __webpack_require__(4);

	var EnemyCell = function(options) {
	  options.pos = options.pos;
	  options.vel = options.vel || [0, 0];
	  options.radius = options.radius;
	  options.color = "#00F";

	  this.avoid = avoid;
	  this.wander = wander;

	  MovingObject.call(this, options);
	};


	var avoid = function(player, rival) {
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
	  // this.vel[0] = (this.vel[0] * Math.random());
	  // this.vel[1] = (this.vel[1] * Math.random());

	  this.move();
	};

	var findVel = function(pos1, pos2, radius) {

	  var buffer = radius * 4

	  var diffX = (pos1[0] - pos2[0])/buffer;
	  var diffY = (pos1[1] - pos2[1])/buffer;
	  return [(diffX), (diffY)];
	};



	Util.inherits(EnemyCell, MovingObject);

	module.exports = EnemyCell;


/***/ }
/******/ ]);
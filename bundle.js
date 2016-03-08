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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	
	var PlayerCell = __webpack_require__(2);
	var EnemyCell = __webpack_require__(5);

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

	PlayerCell.drawTest = function(ctx) {
	  ctx.fillStyle = this.color;

	  ctx.beginPath();
	  ctx.arc(
	    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	  );
	  ctx.fill();
	};

	Util.inherits(PlayerCell, MovingObject);

	module.exports = PlayerCell;


/***/ },
/* 3 */
/***/ function(module, exports) {

	
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
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	};

	MovingObject.prototype.collideWith = function(otherObject) {

	};


	module.exports = MovingObject;


/***/ },
/* 4 */
/***/ function(module, exports) {

	
	var Util = function() { };

	Util.inherits = function(child, base) {
	  function Surrogate () { this.constructor = child };
	  Surrogate.prototype = base.prototype;
	  child.prototype = new Surrogate();
	};

	Util.distance = function(pos1, pos2) {
	  var distX = pos1[0] - pos2[0];
	  var distY = pos1[1] - pos2[1];
	  var distance = Math.sqrt((distX * distX) + (distY * distY));
	  return [distX, distY];
	};
	window.Util = Util;
	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
	var MovingObject = __webpack_require__(3);

	var EnemyCell = function(options) {
	  options.pos = options.pos;
	  options.vel = options.vel || [0, 0];
	  options.radius = 5;
	  options.color = "#00F";

	  MovingObject.call(this, options);
	};

	EnemyCell.prototype.drawTest = function(ctx) {
	  ctx.fillStyle = this.color;

	  ctx.beginPath();
	  ctx.arc(
	    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	  );
	  ctx.fill();
	};

	Util.inherits(EnemyCell, MovingObject);

	module.exports = EnemyCell;


/***/ },
/* 6 */
/***/ function(module, exports) {

	

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


/***/ }
/******/ ]);
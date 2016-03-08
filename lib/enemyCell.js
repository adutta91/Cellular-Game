var Util = require('./util.js');
var MovingObject = require('./movingObject.js');

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

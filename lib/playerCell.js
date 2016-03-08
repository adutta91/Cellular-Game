var MovingObject = require('./movingObject.js');
var Util = require('./util.js');

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

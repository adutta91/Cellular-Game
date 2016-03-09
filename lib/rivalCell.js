var MovingObject = require('./movingObject.js');
var Util = require('./util.js');

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

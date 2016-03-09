var MovingObject = require('./movingObject.js');
var Util = require('./util.js');

var RivalCell = function(options) {
  options.pos = options.pos;
  options.vel = options.vel || [0, 0];
  options.radius = 50;
  options.color = "#F00";

  this.follow = follow;
  this.seek = seek;

  MovingObject.call(this, options);
}

var follow = function(pos, buffer) {
  this.vel = findVel(this.pos, pos, this.radius, buffer);
  this.move();
};

var seek = function(pos) {
  this.vel = [(pos[0] - this.pos[0]), (pos[1] - this.pos[1])];
  this.move();
};

var findVel = function(pos1, pos2, radius, buffer) {
  if (pos1 === undefined || pos2 === undefined) {
    // debugger;
  }
  var diffX = (pos2[0] - pos1[0])/buffer;
  var diffY = (pos2[1] - pos1[1])/buffer;
  return [(diffX), (diffY)];
};


Util.inherits(RivalCell, MovingObject);

module.exports = RivalCell;

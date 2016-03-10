var MovingObject = require('./movingObject.js');
var Util = require('./util.js');

var RivalCell = function(options) {
  options.pos = options.pos;
  options.vel = options.vel || [0, 0];
  options.radius = options.radius || 20;
  options.color = "#F00";

  this.follow = follow;
  this.seek = seek;

  MovingObject.call(this, options);
}

var follow = function(pos, buffer) {

  var vel = findVel(this.pos, pos, this.radius, buffer);
  // if (!vel === 'undefined') { this.vel = vel }
  this.vel = vel;
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

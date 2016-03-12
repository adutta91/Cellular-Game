var Util = require('./util.js');

var MovingObject = function (options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
};

MovingObject.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.strokeStyle = "#000000";

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

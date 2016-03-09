var Util = require('./util.js');
var MovingObject = require('./movingObject.js');

var EnemyCell = function(options) {
  options.pos = options.pos;
  options.vel = options.vel || [Math.random(), Math.random()];
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

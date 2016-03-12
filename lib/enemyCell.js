var Util = require('./util.js');
var MovingObject = require('./movingObject.js');

var EnemyCell = function(options) {
  options.pos = options.pos;
  options.vel = options.vel || [0, 0];
  options.radius = options.radius;
  options.color = "#628FD8";

  this.avoid = avoid;
  this.wander = wander;
  this.wanderingInterval = null;

  MovingObject.call(this, options);
};


var avoid = function(player, rival) {
  clearInterval(this.wanderingInterval);
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

  // this.wanderingInterval = setInterval(3000, changeVel.bind(this));

  this.move();
};

var changeVel = function() {
  var velX = Util.getRandomInRange(20, 100)/(this.radius);
  var velY = Util.getRandomInRange(20, 100)/(this.radius);

  this.vel = [Util.getRandomInRange(0, 5), Util.getRandomInRange(0, 5)]
};

var findVel = function(pos1, pos2, radius) {

  var buffer = radius * 4

  var diffX = (pos1[0] - pos2[0])/buffer;
  var diffY = (pos1[1] - pos2[1])/buffer;
  return [(diffX), (diffY)];
};



Util.inherits(EnemyCell, MovingObject);

module.exports = EnemyCell;

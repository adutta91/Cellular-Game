
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

Util.ensureSmallEnemies = function(playerRadius, enemies) {
  var count = 0;
  enemies.forEach(function(cell) {
    if (cell.radius < playerRadius) {
      count += 1;
    }
  });
  if (count === 0) {
    enemies[this.getRandomInRange(0, (enemies.length - 1))].radius = 10;
  }
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

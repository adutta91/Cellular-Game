var Util = require('./util.js');
var MovingObject = require('./movingObject.js');

var EnemyCell = function(options) {
  options.pos = options.pos;
  options.vel = options.vel || [0, 0];
  options.radius = options.radius;
  options.color = "#00F";

  MovingObject.call(this, options);
};


Util.inherits(EnemyCell, MovingObject);

module.exports = EnemyCell;

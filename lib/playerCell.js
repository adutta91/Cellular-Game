var MovingObject = require('./movingObject.js');
var Util = require('./util.js');

var PlayerCell = function(options) {
  options.pos = options.pos;
  options.vel = options.vel || [0, 0];
  options.radius = 15;
  options.color = "#4FB34F";

  MovingObject.call(this, options);
}


Util.inherits(PlayerCell, MovingObject);

module.exports = PlayerCell;

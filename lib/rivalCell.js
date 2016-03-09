var MovingObject = require('./movingObject.js');
var Util = require('./util.js');

var RivalCell = function(options) {
  options.pos = options.pos;
  options.vel = options.vel || [0, 0];
  options.radius = 15;
  options.color = "#F00";

  MovingObject.call(this, options);
}

Util.inherits(RivalCell, MovingObject);

module.exports = RivalCell;

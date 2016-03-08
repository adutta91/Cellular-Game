
var Util = function() { };

Util.inherits = function(child, base) {
  function Surrogate () { this.constructor = child };
  Surrogate.prototype = base.prototype;
  child.prototype = new Surrogate();
};

Util.distance = function(pos1, pos2) {
  var distX = pos1[0] - pos2[0];
  var distY = pos1[1] - pos2[1];
  var distance = Math.sqrt((distX * distX) + (distY * distY));
  return [distX, distY];
};
window.Util = Util;
module.exports = Util;

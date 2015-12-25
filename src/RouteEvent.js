/**
 * RouteEvent class.
 * @param attrs {Object}
 * @constructor
 */

function RouteEvent (attrs) {
  for (var key in attrs) {
    if (attrs.hasOwnProperty(key)) {
      this[key] = attrs[key];
    }
  }
}

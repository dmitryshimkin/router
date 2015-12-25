/**
 * Route class
 * @param name {String}
 * @param pattern {RegExp}
 * @constructor
 */

function Route (name, pattern) {
  this.name = name;
  this.pattern = pattern;
}

/**
 * @param location {String}
 * @public
 */

Route.prototype.matches = function RouteMatches (location) {
  var match = location.match(this.pattern);
  console.log(this.pattern, location, match);
  return match;
};

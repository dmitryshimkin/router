// ================================================
// Route Event
// ================================================

/**
 * RouteEvent class.
 * @param type {String}
 * @param routes {Array}
 * @constructor
 */

function RouteEvent (type, routes) {
  this.type = type;
  this.routes = routes;
}

/**
 * Route change event name
 * @string
 * @static
 */

RouteEvent.EVT_ROUTE_CHANGE = 'routechange';

/**
 * Route end event name
 * @string
 * @static
 */

RouteEvent.EVT_ROUTE_END = 'routeend';

/**
 * Route start event name
 * @string
 * @static
 */

RouteEvent.EVT_ROUTE_START = 'routestart';

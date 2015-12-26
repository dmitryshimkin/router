;(function (win) {
  'use strict';

  /**
   * Extends given target object with another object
   * @param target {Object}
   * @param obj {Object}
   * @returns {Object}
   * @private
   */

  function extend (target, obj) {
    each(obj, function (value, key) {
      target[key] = value;
    });
    return target;
  }

  /**
   * Iterates through all properties in object and invokes
   * given callback for each property.
   * @param arg {Object|Array}
   * @param fn {Function}
   * @param ctx {Object} Context for the callback
   * @returns {Object|Array}
   * @private
   */

  function each (arg, fn, ctx) {
    if ('length' in arg) {
      for (var i = 0, len = arg.length; i < len; i++) {
        fn.call(ctx, arg[i], i);
      }
    } else {
      for (var key in arg) {
        if (arg.hasOwnProperty(key)) {
          fn.call(ctx, arg[key], key);
        }
      }
    }
    return arg;
  }

  /**
   * @param arr {Array}
   * @param fn {Function}
   * @param ctx {Object} Context for the callback
   * @returns {Array}
   * @private
   */

  function map (arr, fn, ctx) {
    var result = new Array(arr.length);
    for (var i = 0, len = arr.length; i < len; i++) {
      result[i] = fn.call(ctx, arr[i], i);
    }
    return result;
  }

  /**
   * Prints warning on console.
   * @param msg {String}
   * @private
   */

  function warn (msg) {
    try {
      console.warn(msg);
    } catch (ex) {
    }
  }

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
    return location.match(this.pattern);
  };

  /**
   * RouteEvent class.
   * @param attrs {Object}
   * @constructor
   */

  function RouteEvent (attrs) {
    extend(this, attrs);
  }

  function getMatchingRoutes (routes, location) {
    var matchingRoutes = [];

    each(routes, function (route) {
      if (route.matches(location)) {
        matchingRoutes.push(route.name);
      }
    });

    return matchingRoutes;
  }

  function checkRoutes () {
    var matchingRoutes = getMatchingRoutes(this.routes, this.location);
    var ctx = this.context || null;
    var activeRoutes = [];
    var toAdd = [];
    var toRemove = [];
    var toUpdate = [];

    // Find obsolete routes
    each(this.activeRoutes, function (activeRoute) {
      if (matchingRoutes.indexOf(activeRoute) !== -1) {
        activeRoutes.push(activeRoute);
        toUpdate.push(activeRoute);
      } else {
        toRemove.push(activeRoute);
      }
    });

    // Find new active routes
    each(matchingRoutes, function (matchingRoute) {
      if (activeRoutes.indexOf(matchingRoute) === -1) {
        activeRoutes.push(matchingRoute);
        toAdd.push(matchingRoute);
      }
    });

    this.activeRoutes = activeRoutes;

    if (typeof this.onRoute === 'function') {
      // Notify `routechange`
      if (toUpdate.length) {
        this.onRoute.call(ctx, new RouteEvent({
          type: 'routechange',
          routes: map(toUpdate, function (name) {
            return {
              name: name,
              params: []
            };
          })
        }));
      }

      // Notify `routeend`
      if (toRemove.length) {
        this.onRoute.call(ctx, new RouteEvent({
          type: 'routeend',
          routes: map(toRemove, function (name) {
            return {
              name: name
            };
          })
        }));
      }

      // Notify `routestart`
      if (toAdd.length) {
        this.onRoute.call(ctx, new RouteEvent({
          type: 'routestart',
          routes: map(toAdd, function (name) {
            return {
              name: name,
              params: []
            };
          })
        }));
      }
    }
  }

  /**
   * Router
   * @class
   */

  function Router () {
    this.location = '';
    this.routes = {};
    this.activeRoutes = [];
  }

  Router.prototype.addRoute = function addRoute (name, pattern) {
    if (!this.routes[name]) {
      this.routes[name] = new Route(name, pattern);
    } else {
      warn('Route `' + name + '` is already added');
    }
  };

  /**
   * Returns current location.
   * @returns {String}
   * @public
   */

  Router.prototype.getLocation = function getLocation () {
    return this.location;
  };

  /**
   * Sets location.
   * @param location {String}
   * @public
   */

  Router.prototype.setLocation = function setLocation (location) {
    if (location !== this.location) {
      this.location = location;
      checkRoutes.call(this);
    }
  };

  if (typeof define === 'function' && define.amd) {
    define('Router', Router); // AMD
  } else if (typeof exports === 'object') {
    module.exports = Router; // Node, CommonJS-like
  } else {
    win.Router = Router; // Browser globals (root is window)
  }
}(this));
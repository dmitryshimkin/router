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
        /* istanbul ignore else */
        if (arg.hasOwnProperty(key)) {
          fn.call(ctx, arg[key], key);
        }
      }
    }
    return arg;
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

  /**
   * Adds location to the queue and process queue
   * @param location {String}
   * @private
   */

  function addLocationToQueue (location) {
    this._queue.push(location);
    if (!this._processing) {
      processQueue.call(this);
    }
  }

  /**
   * @param match {Array}
   * @private
   * @static
   */

  function getParams (match) {
    return match ? match.slice(1, match.length) : [];
  }

  /**
   * TBD
   * @param routes {Array}
   * @param name {String}
   * @returns {Object}
   * @private
   * @static
   */

  function findRoute (routes, name) {
    var i = routes.length;
    while (i--) {
      if (routes[i].name === name) {
        return routes[i];
      }
    }
    return null;
  }

  /**
   * TBD
   * @private
   */

  function hasRoute (routes, route) {
    return findRoute(routes, route.name) !== null;
  }

  /**
   * @private
   */

  function getMatchingRoutes (routes, location) {
    var matchingRoutes = [];

    each(routes, function (route) {
      var match = route.matches(location);
      if (match) {
        matchingRoutes.push({
          name: route.name,
          params: getParams(match)
        });
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
      var newActiveRoute = findRoute(matchingRoutes, activeRoute.name);
      if (newActiveRoute) {
        activeRoutes.push(newActiveRoute);
        toUpdate.push(newActiveRoute);
      } else {
        toRemove.push({
          name: activeRoute.name
        });
      }
    });

    // Find new active routes
    each(matchingRoutes, function (matchingRoute) {
      if (!hasRoute(activeRoutes, matchingRoute)) {
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
          routes: toUpdate
        }));
      }

      // Notify `routeend`
      if (toRemove.length) {
        this.onRoute.call(ctx, new RouteEvent({
          type: 'routeend',
          routes: toRemove
        }));
      }

      // Notify `routestart`
      if (toAdd.length) {
        this.onRoute.call(ctx, new RouteEvent({
          type: 'routestart',
          routes: toAdd
        }));
      }
    }
  }

  /**
   * @private
   */

  function processQueue () {
    var location = this._queue.shift();
    if (location) {
      this._processing = true;

      this.location = location;

      checkRoutes.call(this);

      if (this._queue.length) {
        processQueue.call(this);
      }

      this._processing = false;
    }
  }

  /**
   * Router
   * @class
   */

  function Router () {
    this._queue = [];
    this._processing = false;
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
      addLocationToQueue.call(this, location);
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
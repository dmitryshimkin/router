;(function (win) {
  'use strict';

  function extend (target, obj) {
    each(obj, function (value, key) {
      target[key] = value;
    });
    return target;
  }

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

  function map (arr, fn, ctx) {
    var result = new Array(arr.length);
    for (var i = 0, len = arr.length; i < len; i++) {
      result[i] = fn.call(ctx, arr[i], i);
    }
    return result;
  }

  function filter (arr, fn, ctx) {
    var result = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      if (fn.call(ctx, arr[i], i)) {
        result.push(arr[i]);
      }
    }
    return [];
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
    var match = location.match(this.pattern);
    console.log(this.pattern, location, match);
    return match;
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
              params: [1, 2]
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
              name: name,
              params: [1, 2]
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
              params: [1, 2]
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
/**
 * Router
 * Version: 0.0.1
 * Author: Dmitry Shimkin <dmitryshimkin@gmail.com>
 * License: MIT
 * https://github.com/dmitryshimkin/router
 */
;(function (win) {
  'use strict';

  // ================================================
  // Utilities
  // ================================================

  var supportsObjectCreate = isFunction(Object.create);

  /**
   * Creates an object with given prototype
   * @param proto {Object}
   * @returns {Object}
   * @private
   */
  function createRouter (proto) {
    function Router() {}
    /* istanbul ignore else */
    if (supportsObjectCreate) {
      return Object.create(proto);
    } else {
      Router.prototype = proto;
      var obj = new Router();
      Router.prototype = null;
      return obj;
    }
  }

  /**
   * Extends given target object with another object.
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
   *
   * @param arg {*}
   * @returns {Boolean}
   * @private
   */

  function isFunction (arg) {
    return typeof arg === 'function';
  }

  /**
   * Prints given warning in the console.
   * @param msg {String}
   * @private
   */

  function warn (msg) {
    try {
      console.warn(msg);
    } catch (ex) {
    }
  }

  // ================================================
  // Route
  // ================================================

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

  // ================================================
  // Route Event
  // ================================================

  /**
   * RouteEvent class.
   * @param attrs {Object}
   * @constructor
   */

  function RouteEvent (attrs) {
    extend(this, attrs);
  }

  // ================================================
  // Router
  // ================================================

  /**
   * Adds location to the queue and process queue
   * @param location {String}
   * @param inst {Router}
   * @param props {Object}
   * @private
   */

  function addLocationToQueue (location, inst, props) {
    props.queue.push(location);
    if (!props.isProcessing) {
      processQueue(inst, props);
    }
  }

  /**
   * @param match {Array}
   * @private
   * @static
   */

  function getParams (match) {
    return match
      ? match.slice(1, match.length)
      : [];
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

  /**
   *
   * @param props {Object}
   * @private
   */

  function checkRoutes (inst, props) {
    var matchingRoutes = getMatchingRoutes(props.routes, props.location);
    var ctx = props.context || null;
    var activeRoutes = [];
    var toAdd = [];
    var toRemove = [];
    var toUpdate = [];

    // Find obsolete routes
    each(props.activeRoutes, function (activeRoute) {
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

    props.activeRoutes = activeRoutes;

    if (isFunction(inst.onRoute)) {
      // Notify `routechange`
      if (toUpdate.length) {
        inst.onRoute.call(ctx, new RouteEvent({
          type: 'routechange',
          routes: toUpdate
        }));
      }

      // Notify `routeend`
      if (toRemove.length) {
        inst.onRoute.call(ctx, new RouteEvent({
          type: 'routeend',
          routes: toRemove
        }));
      }

      // Notify `routestart`
      if (toAdd.length) {
        inst.onRoute.call(ctx, new RouteEvent({
          type: 'routestart',
          routes: toAdd
        }));
      }
    }
  }

  /**
   *
   * @param inst {Router}
   * @param props {Object}
   * @private
   */

  function processQueue (inst, props) {
    var location = props.queue.shift();
    if (location) {
      props.isProcessing = true;
      props.location = location;

      checkRoutes(inst, props);

      if (props.queue.length) {
        processQueue(inst, props);
      }

      props.isProcessing = false;
    }
  }

  /**
   * Router
   * @class
   */

  function Router () {
    var router = createRouter(Router.prototype);

    var props = {
      queue: [],
      isProcessing: false,
      activeRoutes: [],
      location: '',
      routes: {}
    };

    /**
     * @param name {String}
     * @param pattern {RegExp}
     * @public
     */

    function addRoute (name, pattern) {
      if (!props.routes[name]) {
        props.routes[name] = new Route(name, pattern);
      } else {
        warn('Route `' + name + '` is already added');
      }
    }

    /**
     * Returns current location.
     * @returns {String}
     * @public
     */

    function getLocation () {
      return props.location;
    }

    /**
     * Sets location.
     * @param location {String}
     * @public
     */

    function setLocation (location) {
      if (location !== props.location) {
        addLocationToQueue(location, router, props);
      }
    }

    router.addRoute = addRoute;
    router.getLocation = getLocation;
    router.setLocation = setLocation;

    return router;
  }

  // ================================================
  // Export
  // ================================================

  if (typeof define === 'function' && define.amd) {
    define('Router', Router); // AMD
  } else if (typeof exports === 'object') {
    module.exports = Router; // Node, CommonJS-like
  } else {
    win.Router = Router; // Browser globals (root is window)
  }
}(this));
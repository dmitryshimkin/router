/**
 * Router
 * Version: 1.0.0
 * Author: Dmitry Shimkin <dmitryshimkin@gmail.com>
 * License: MIT
 * https://github.com/dmitryshimkin/router
 */
;(function () {
  'use strict';

  // ================================================
  // Utils
  // ================================================

  var supportsObjectCreate = isFunction(Object.create);

  /**
   * Creates an object with given prototype
   * @param routerProto {Object}
   * @returns {Object}
   * @private
   */
  function createRouter (routerProto) {
    function Router() {}
    /* istanbul ignore else */
    if (supportsObjectCreate) {
      return Object.create(routerProto);
    } else {
      Router.prototype = routerProto;
      var obj = new Router();
      Router.prototype = null;
      return obj;
    }
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
   * TBD
   * @param arg {*}
   * @returns {Boolean}
   * @private
   */

  function isFunction (arg) {
    return typeof arg === 'function';
  }

  /**
   * TBD
   * @param arg {*}
   * @returns {Boolean}
   * @private
   */

  function isObject (arg) {
    return typeof arg === 'object' && arg !== null;
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
    if (props.redirectCount > Router.MAX_REDIRECT_COUNT) {
      props.redirectCount = 0;
      throw Error('Too many redirects');
    }

    props.queue.push(location);
    if (!props.isProcessing) {
      processQueue(inst, props);
    }
  }

  /**
   * TBD
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
   * TBD
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
   * TBD
   * @param inst {Router}
   * @param props {Object}
   * @private
   */

  function checkRoutes (inst, props) {
    var matchingRoutes = getMatchingRoutes(props.routes, props.location);
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
        inst.onRoute(new RouteEvent(RouteEvent.EVT_ROUTE_CHANGE, toUpdate));
      }

      // Notify `routeend`
      if (toRemove.length) {
        inst.onRoute(new RouteEvent(RouteEvent.EVT_ROUTE_END, toRemove));
      }

      // Notify `routestart`
      if (toAdd.length) {
        inst.onRoute(new RouteEvent(RouteEvent.EVT_ROUTE_START, toAdd));
      }
    }
  }

  /**
   * TBD
   * @param inst {Router}
   * @param props {Object}
   * @private
   */

  function processQueue (inst, props) {
    var location = props.queue[0];
    if (location) {
      props.redirectCount++;

      props.isProcessing = true;
      props.location = location;

      checkRoutes(inst, props);

      props.queue.shift();

      if (props.queue.length) {
        processQueue(inst, props);
      }

      props.isProcessing = false;
      props.redirectCount--;
    }
  }

  /**
   * Router
   * @param routes {Object}
   * @class
   */

  function Router (routes) {
    var router = createRouter(Router.prototype);

    // Private props
    var props = {
      queue: [],
      isProcessing: false,
      activeRoutes: [],
      location: '',
      redirectCount: 0,
      routes: {}
    };

    /**
     * TBD
     * @param routes {Object}
     * @public
     */

    function addRoute (routes) {
      if (!isObject(routes)) {
        var name = arguments[0];
        var pattern = arguments[1];
        routes = {};
        routes[name] = pattern;
      }

      each(routes, function (pattern, name) {
        if (!props.routes[name]) {
          props.routes[name] = new Route(name, pattern);
        } else {
          warn('Route `' + name + '` is already added');
        }
      });
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

    // Expose public API
    router.addRoute = addRoute;
    router.getLocation = getLocation;
    router.setLocation = setLocation;

    if (routes) {
      router.addRoute(routes);
    }

    return router;
  }

  /**
   * TBD
   * @number
   * @static
   */

  Router.MAX_REDIRECT_COUNT = 10;

  // ================================================
  // Export
  // ================================================

  if (typeof define === 'function' && define.amd) {
    define('Router', Router); // AMD
  } else if (typeof exports === 'object') {
    module.exports = Router; // Node, CommonJS-like
  } else {
    window.Router = Router; // Browser global
  }
}());
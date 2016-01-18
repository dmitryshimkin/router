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
 * @class
 */

function Router () {
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

  // Expose public API
  router.addRoute = addRoute;
  router.getLocation = getLocation;
  router.setLocation = setLocation;

  return router;
}

/**
 * TBD
 * @number
 * @static
 */
Router.MAX_REDIRECT_COUNT = 10;

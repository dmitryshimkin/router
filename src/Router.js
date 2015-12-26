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

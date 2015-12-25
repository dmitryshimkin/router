function getMatchingRoutes (routes, location) {
  var matchingRoutes = [];
  for (var route in routes) {
    if (routes.hasOwnProperty(route)) {
      if (routes[route].matches(location)) {
        matchingRoutes.push(routes[route].name);
      }
    }
  }
  return matchingRoutes;
}

function checkRoutes () {
  var ctx = this.context || null;

  var matchingRoutes = getMatchingRoutes(this.routes, this.location);
  var matchingRoute;

  var toAdd = [];
  var toRemove = [];
  var toUpdate = [];

  var activeRoutes = [];
  var activeRoute;
  var i;

  // Find obsolete routes
  for (i = 0; i < this.activeRoutes.length; i++) {
    activeRoute = this.activeRoutes[i];
    if (matchingRoutes.indexOf(activeRoute) !== -1) {
      activeRoutes.push(activeRoute);
      toUpdate.push(activeRoute);
    } else {
      toRemove.push(activeRoute);
    }
  }

  // Find new active routes
  for (i = 0; i < matchingRoutes.length; i++) {
    matchingRoute = matchingRoutes[i];
    if (activeRoutes.indexOf(matchingRoute) === -1) {
      activeRoutes.push(matchingRoute);
      toAdd.push(matchingRoute);
    }
  }

  this.activeRoutes = activeRoutes;

  if (typeof this.onRoute === 'function') {
    // Notify `routechange`
    if (toUpdate.length) {
      this.onRoute.call(ctx, new RouteEvent({
        type: 'routechange',
        routes: toUpdate.map(function (name) {
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
        routes: toRemove.map(function (name) {
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
        routes: toAdd.map(function (name) {
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

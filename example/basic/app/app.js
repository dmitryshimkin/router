(function () {
  'use strict';

  /**
   *
   */

  function App () {
    this.components = {};

    this.initRouter();
    this.bindEvents();
    this.run();
  }

  App.DEFAULT_URL = '/book';

  App.Routes = {
    books: /^\/book$/,
    book: /^\/book\/(\d+)$/
  };

  /**
   *
   */

  App.prototype.initRouter = function () {
    this.router = new Router(App.Routes);
  };

  /**
   *
   */

  App.prototype.bindEvents = function () {
    var app = this;

    app.router.onRoute = function (evt) {
      for (var i = 0; i < evt.routes.length; i++) {
        var route = evt.routes[i];
        switch (evt.type) {
          case 'routestart':
            app.createComponent(route.name, route.params);
            break;
          case 'routechange':
            app.updateComponent(route.name, route.params);
            break;
          case 'routeend':
            app.destroyComponent(route.name);
            break;
          default:
          break;
        }
      }
    };

    WinLocation.onChange = function (location) {
      app.navigateTo(location);
    }
  };

  /**
   *
   */

  App.prototype.createComponent = function (name, params) {
    console.log('Create component', name, params);
  };

  /**
   *
   */

  App.prototype.destroyComponent = function (name) {
    console.log('Destroy component', name);
  };

  /**
   *
   */

  App.prototype.updateComponent = function (name, params) {
    console.log('Update component', name, params);
  };

  /**
   *
   */

  App.prototype.navigateTo = function (location) {
    console.log('navigate to', location);
    if (location !== this.router.getLocation()) {
      console.log('set location', location);
      WinLocation.setLocation(location);
      this.router.setLocation(location);
    }
  };

  /**
   * @public
   */

  App.prototype.run = function () {
    this.navigateTo(WinLocation.getLocation() || App.DEFAULT_URL);
  };

  // ===========================================
  // Export
  // ===========================================

  window.App = App;
}());

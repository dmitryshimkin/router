describe('Router', function () {
  'use strict';

  describe('Class', function () {
    it('should exist', function () {
      expect(typeof window.Router).toBe('function');
    });

    it('should create instance of Router', function () {
      var router = new Router();
      expect(router instanceof Router).toBe(true);
    });
  });

  describe('Location', function () {
    it('should have empty location by default', function () {
      var router = new Router();
      expect(router.getLocation()).toBe('');
    });

    describe('setLocation', function () {
      it('should update current location of the router', function () {
        var router = new Router();
        router.setLocation('/products/123');
        expect(router.getLocation()).toBe('/products/123');
      });
    });
  });

  describe('onRoute', function () {
    describe('routestart', function () {
      it('should be called on location change for all routes that didn\'t match to previous location but do match to new location', function () {
        var router = new Router();
        var onRouteStart = jasmine.createSpy('onRouteStart');

        router.addRoute('A1', /^a$/);
        router.addRoute('A2', /^a/);
        router.addRoute('B', /^b/);

        router.onRoute = function (evt) {
          if (evt.type === 'routestart') {
            onRouteStart.apply(this, arguments);
          }
        };

        // Location doesn't match to added routes, so onRouteStart hasn't been called
        router.setLocation('c');
        expect(onRouteStart.calls.count()).toBe(0);

        // Location starts to match to "A1" and "A2", so onRouteStart is called
        router.setLocation('a');
        expect(onRouteStart.calls.count()).toBe(1);

        // Location still matches to "A2", but there is no
        // new matching routes so onRouteStart wasn't called
        router.setLocation('ab');
        expect(onRouteStart.calls.count()).toBe(1);

        // Location starts to match to "B", so onRouteStart is called again
        router.setLocation('b');
        expect(onRouteStart.calls.count()).toBe(2);
      });

      it('event object shoud have matches', function () {
        var router = new Router();
        var onRouteStart = jasmine.createSpy('onRouteStart');
        var evt;

        router.addRoute('A1', /^a$/);
        router.addRoute('A2', /^a/);
        router.addRoute('B', /^b/);

        router.onRoute = function (evt) {
          if (evt.type === 'routestart') {
            onRouteStart.apply(this, arguments);
          }
        };

        router.setLocation('a');
        evt = onRouteStart.calls.argsFor(0)[0];

        // Event object has event type
        expect(evt.type).toBe('routestart');

        // and list of matches
        expect(evt.routes).toEqual([
          {
            name: 'A1',
            params: []
          },
          {
            name: 'A2',
            params: []
          }
        ]);
      });
    });
  });
});

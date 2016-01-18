describe('Router', function () {
  'use strict';

  // ================================================
  // Helpers
  // ================================================

  function $log (log, routeEvent) {
    var routes = routeEvent.routes.map(function (route) {
      return route.name;
    });
    log.push(routeEvent.type + ': ' + routes.join(' '));
  }

  function $printLog (log) {
    log.forEach(function (entry) {
      console.log(entry);
    });
  }

  // ================================================
  // Specs
  // ================================================

  describe('Class', function () {
    it('should exist', function () {
      expect(typeof window.Router).toBe('function');
    });

    it('should create instance of Router', function () {
      var router = new Router();
      expect(router instanceof Router).toBe(true);
    });
  });

  describe('onRoute', function () {
    describe('routestart', function () {
      it('should be called on location change for all routes that didn\'t match to previous location but do match to new location', function () {
        var router = new Router();
        var onRouteStart = jasmine.createSpy('onRouteStart');
        var routeEvent;

        router.addRoute('A1', /^a$/);
        router.addRoute('A2', /^a/);
        router.addRoute('B', /^b/);

        router.onRoute = function (routeEvent) {
          if (routeEvent.type === 'routestart') {
            onRouteStart.apply(this, arguments);
          }
        };

        // Location doesn't match to added routes, so onRouteStart hasn't been called
        router.setLocation('c');
        expect(onRouteStart.calls.count()).toBe(0);

        // Location starts to match to "A1" and "A2", so onRouteStart is called
        router.setLocation('a');
        routeEvent = onRouteStart.calls.argsFor(0)[0];

        expect(onRouteStart.calls.count()).toBe(1);
        expect(routeEvent.type).toBe('routestart');
        expect(routeEvent.routes).toEqual([
          {
            name: 'A1',
            params: []
          },
          {
            name: 'A2',
            params: []
          }
        ]);

        // Location still matches to "A2", but there is no
        // new matching routes so onRouteStart wasn't called
        router.setLocation('ab');
        expect(onRouteStart.calls.count()).toBe(1);

        // Location starts to match to "B", so onRouteStart is called again
        router.setLocation('b');
        routeEvent = onRouteStart.calls.argsFor(1)[0];

        expect(onRouteStart.calls.count()).toBe(2);
        expect(routeEvent.type).toBe('routestart');
        expect(routeEvent.routes).toEqual([{
          name: 'B',
          params: []
        }]);
      });
    });

    describe('routechange', function () {
      it('should be called on location change for all routes that matched to previous location and still do match to new location', function () {
        var router = new Router();
        var onRouteChange = jasmine.createSpy('onRouteChange');
        var routeEvent;

        router.addRoute('A1', /^aa/);
        router.addRoute('A2', /^aaa/);
        router.addRoute('B', /^b/);

        router.onRoute = function (routeEvent) {
          if (routeEvent.type === 'routechange') {
            onRouteChange.apply(this, arguments);
          }
        };

        router.setLocation('aa');
        expect(onRouteChange.calls.count()).toBe(0);

        router.setLocation('aaa');
        routeEvent = onRouteChange.calls.argsFor(0)[0];

        expect(onRouteChange.calls.count()).toBe(1);
        expect(routeEvent.type).toBe('routechange');
        expect(routeEvent.routes).toEqual([
          { name: 'A1', params: [] }
        ]);

        router.setLocation('aaaa');
        routeEvent = onRouteChange.calls.argsFor(1)[0];

        expect(onRouteChange.calls.count()).toBe(2);
        expect(routeEvent.type).toBe('routechange');
        expect(routeEvent.routes).toEqual([
          { name: 'A1', params: [] },
          { name: 'A2', params: [] }
        ]);
      });
    });

    describe('routeend', function () {
      it('should be called on location change for all routes that matched to previous location but don\'t match to new location', function () {
        var router = new Router();
        var onRouteEnd = jasmine.createSpy('onRouteEnd');
        var routeEvent;

        router.addRoute('A1', /^a$/);
        router.addRoute('A2', /^a/);
        router.addRoute('B', /^b/);

        router.onRoute = function (routeEvent) {
          if (routeEvent.type === 'routeend') {
            onRouteEnd.apply(this, arguments);
          }
        };

        router.setLocation('a');
        expect(onRouteEnd.calls.count()).toBe(0);

        router.setLocation('b');
        routeEvent = onRouteEnd.calls.argsFor(0)[0];

        expect(onRouteEnd.calls.count()).toBe(1);
        expect(routeEvent.type).toBe('routeend');
        expect(routeEvent.routes).toEqual([{
          name: 'A1'
        }, {
          name: 'A2'
        }]);

        router.setLocation('c');
        routeEvent = onRouteEnd.calls.argsFor(1)[0];

        expect(onRouteEnd.calls.count()).toBe(2);
        expect(routeEvent.type).toBe('routeend');
        expect(routeEvent.routes).toEqual([{
          name: 'B'
        }]);

        router.setLocation('d');
        expect(onRouteEnd.calls.count()).toBe(2);
      });
    });
  });

  describe('addRoute', function () {
    it('should add given route', function () {
      var router = new Router();
      var onRouteStart = jasmine.createSpy('onRouteStart');
      var routeEvent;

      router.addRoute('A1', /^aa/);
      router.addRoute('B', /^b/);

      router.onRoute = function (routeEvent) {
        if (routeEvent.type === 'routestart') {
          onRouteStart.apply(this, arguments);
        }
      };

      router.setLocation('aa');
      routeEvent = onRouteStart.calls.argsFor(0)[0];

      expect(onRouteStart.calls.count()).toBe(1);
      expect(routeEvent.routes.length).toBe(1);
      expect(routeEvent.routes[0].name).toBe('A1');

      router.addRoute('A2', /^aaa/);
      expect(onRouteStart.calls.count()).toBe(1);

      router.setLocation('aaa');
      routeEvent = onRouteStart.calls.argsFor(1)[0];

      expect(onRouteStart.calls.count()).toBe(2);
      expect(routeEvent.routes.length).toBe(1);
      expect(routeEvent.routes[0].name).toBe('A2');
    });

    it('should be ignored if given route is already added', function () {
      var router = new Router();
      var onRouteStart = jasmine.createSpy('onRouteStart');
      var routeEvent;

      router.addRoute('A1', /^aa/);
      router.addRoute('B', /^b/);

      router.onRoute = function (routeEvent) {
        if (routeEvent.type === 'routestart') {
          onRouteStart.apply(this, arguments);
        }
      };

      router.setLocation('aa');
      routeEvent = onRouteStart.calls.argsFor(0)[0];

      expect(onRouteStart.calls.count()).toBe(1);
      expect(routeEvent.routes.length).toBe(1);
      expect(routeEvent.routes[0].name).toBe('A1');

      router.addRoute('A1', /^aaa/);
      expect(onRouteStart.calls.count()).toBe(1);

      router.setLocation('aaa');
      expect(onRouteStart.calls.count()).toBe(1);
    });
  });

  describe('Route params', function () {
    it('should pass route parameters to onRoute handler', function () {
      var router = new Router();

      var onRouteStart = jasmine.createSpy('onRouteStart');
      var onRouteChange = jasmine.createSpy('onRouteChange');
      var onRouteEnd = jasmine.createSpy('onRouteEnd');

      var routeStartEvent;
      var routeChangeEvent;
      var routeEndEvent;

      router.addRoute('A', /^\/projects\/(\d+)/);
      router.addRoute('B', /^\/projects\/(\d+?)\?q=(.+)/);

      router.onRoute = function (routeEvent) {
        switch (routeEvent.type) {
          case 'routestart':
            onRouteStart.apply(this, arguments);
            break;
          case 'routechange':
            onRouteChange.apply(this, arguments);
            break;
          case 'routeend':
            onRouteEnd.apply(this, arguments);
            break;
        }
      };

      router.setLocation('/projects/123');
      routeStartEvent = onRouteStart.calls.argsFor(0)[0];

      expect(routeStartEvent.routes.length).toBe(1);
      expect(routeStartEvent.routes[0].name).toBe('A');
      expect(routeStartEvent.routes[0].params).toEqual(['123']);

      router.setLocation('/projects/123?q=foo');
      routeStartEvent = onRouteStart.calls.argsFor(1)[0];

      expect(routeStartEvent.routes.length).toBe(1);
      expect(routeStartEvent.routes[0].name).toBe('B');
      expect(routeStartEvent.routes[0].params).toEqual(['123', 'foo']);

      routeChangeEvent = onRouteChange.calls.argsFor(0)[0];

      expect(routeChangeEvent.routes.length).toBe(1);
      expect(routeChangeEvent.routes[0].name).toBe('A');
      expect(routeChangeEvent.routes[0].params).toEqual(['123']);

      router.setLocation('/projects/123?q=bar');
      routeChangeEvent = onRouteChange.calls.argsFor(1)[0];

      expect(routeChangeEvent.routes.length).toBe(2);
      expect(routeChangeEvent.routes[0].name).toBe('A');
      expect(routeChangeEvent.routes[0].params).toEqual(['123']);
      expect(routeChangeEvent.routes[1].name).toBe('B');
      expect(routeChangeEvent.routes[1].params).toEqual(['123', 'bar']);

      router.setLocation('/projects');
      routeEndEvent = onRouteEnd.calls.argsFor(0)[0];

      expect(routeEndEvent.routes.length).toBe(2);
      expect(routeEndEvent.routes[0].name).toBe('A');
      expect(routeEndEvent.routes[1].name).toBe('B');
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

      it('should be ignored when called with the same location', function () {
        var router = new Router();
        var onRouteChange = jasmine.createSpy('onRouteChange');

        router.addRoute('A1', /^aa/);
        router.addRoute('A2', /^aaa/);
        router.addRoute('B', /^b/);

        router.onRoute = function (routeEvent) {
          if (routeEvent.type === 'routechange') {
            onRouteChange.apply(this, arguments);
          }
        };

        router.setLocation('aa');
        router.setLocation('aaa');
        expect(onRouteChange.calls.count()).toBe(1);

        router.setLocation('aaa');
        expect(onRouteChange.calls.count()).toBe(1);
      });
    });

    describe('Queue', function () {
      it('should invoke all onRoute callbacks before location change', function () {
        var router = new Router();
        var redirectCount = 0;
        var log = [];

        router.addRoute('Route_A', /^path_a/);
        router.addRoute('Route_AB', /^path_ab/);

        router.onRoute = function (routeEvent) {
          $log(log, routeEvent);
          if (routeEvent.type === 'routechange' && !redirectCount) {
            redirectCount = redirectCount + 1;
            router.setLocation('path_a');
          }
        };

        router.setLocation('path_a');
        router.setLocation('path_ab');

        expect(log).toEqual([
          'routestart: Route_A',
          'routechange: Route_A',
          'routestart: Route_AB',
          'routechange: Route_A',
          'routeend: Route_AB'
        ]);
      });

      it('should throw error if redirect limit exceeded', function () {
        Router.MAX_REDIRECT_COUNT = 5;

        var router = new Router();
        var redirectCount = 0;
        var locations = [
          'path_a',
          'path_a2',
          'path_a3',
          'path_a4',
          'path_a5',
          'path_a6',
          'path_a7'
        ];

        router.addRoute('Route_A', /^path_a/);
        router.addRoute('Route_AB', /^path_ab/);

        router.onRoute = function () {
          if (redirectCount < 7) {
            redirectCount = redirectCount + 1;

            if (redirectCount < 6) {
              router.setLocation(locations[redirectCount]);
            } else {
              expect(function () {
                router.setLocation(locations[redirectCount]);
              }).toThrow();
            }
          }
        };

        router.setLocation(locations[0]);
        expect(redirectCount).toBe(6);
      });
    });
  });

  // @todo правильный location в хендлере
  // @todo повторное добавление роута
});

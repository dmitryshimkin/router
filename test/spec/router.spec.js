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

  describe('onRoute', function () {
    describe('routestart', function () {
      it('should be called on location change for all routes that didn\'t match to previous location but do match to new location', function () {
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

        // Location doesn't match to added routes, so onRouteStart hasn't been called
        router.setLocation('c');
        expect(onRouteStart.calls.count()).toBe(0);

        // Location starts to match to "A1" and "A2", so onRouteStart is called
        router.setLocation('a');
        evt = onRouteStart.calls.argsFor(0)[0];

        expect(onRouteStart.calls.count()).toBe(1);
        expect(evt.type).toBe('routestart');
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

        // Location still matches to "A2", but there is no
        // new matching routes so onRouteStart wasn't called
        router.setLocation('ab');
        expect(onRouteStart.calls.count()).toBe(1);

        // Location starts to match to "B", so onRouteStart is called again
        router.setLocation('b');
        evt = onRouteStart.calls.argsFor(1)[0];

        expect(onRouteStart.calls.count()).toBe(2);
        expect(evt.type).toBe('routestart');
        expect(evt.routes).toEqual([{
          name: 'B',
          params: []
        }]);
      });
    });

    describe('routechange', function () {
      it('should be called on location change for all routes that matched to previous location and still do match to new location', function () {
        var router = new Router();
        var onRouteChange = jasmine.createSpy('onRouteChange');
        var evt;

        router.addRoute('A1', /^aa/);
        router.addRoute('A2', /^aaa/);
        router.addRoute('B', /^b/);

        router.onRoute = function (evt) {
          if (evt.type === 'routechange') {
            onRouteChange.apply(this, arguments);
          }
        };

        router.setLocation('aa');
        expect(onRouteChange.calls.count()).toBe(0);

        router.setLocation('aaa');
        evt = onRouteChange.calls.argsFor(0)[0];

        expect(onRouteChange.calls.count()).toBe(1);
        expect(evt.type).toBe('routechange');
        expect(evt.routes).toEqual([
          { name: 'A1', params: [] }
        ]);

        router.setLocation('aaaa');
        evt = onRouteChange.calls.argsFor(1)[0];

        expect(onRouteChange.calls.count()).toBe(2);
        expect(evt.type).toBe('routechange');
        expect(evt.routes).toEqual([
          { name: 'A1', params: [] },
          { name: 'A2', params: [] }
        ]);
      });
    });

    describe('routeend', function () {
      it('should be called on location change for all routes that matched to previous location but don\'t match to new location', function () {
        var router = new Router();
        var onRouteEnd = jasmine.createSpy('onRouteEnd');
        var evt;

        router.addRoute('A1', /^a$/);
        router.addRoute('A2', /^a/);
        router.addRoute('B', /^b/);

        router.onRoute = function (evt) {
          if (evt.type === 'routeend') {
            onRouteEnd.apply(this, arguments);
          }
        };

        router.setLocation('a');
        expect(onRouteEnd.calls.count()).toBe(0);

        router.setLocation('b');
        evt = onRouteEnd.calls.argsFor(0)[0];

        expect(onRouteEnd.calls.count()).toBe(1);
        expect(evt.type).toBe('routeend');
        expect(evt.routes).toEqual([{
          name: 'A1'
        }, {
          name: 'A2'
        }]);

        router.setLocation('c');
        evt = onRouteEnd.calls.argsFor(1)[0];

        expect(onRouteEnd.calls.count()).toBe(2);
        expect(evt.type).toBe('routeend');
        expect(evt.routes).toEqual([{
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
      var evt;

      router.addRoute('A1', /^aa/);
      router.addRoute('B', /^b/);

      router.onRoute = function (evt) {
        if (evt.type === 'routestart') {
          onRouteStart.apply(this, arguments);
        }
      };

      router.setLocation('aa');
      evt = onRouteStart.calls.argsFor(0)[0];

      expect(onRouteStart.calls.count()).toBe(1);
      expect(evt.routes.length).toBe(1);
      expect(evt.routes[0].name).toBe('A1');

      router.addRoute('A2', /^aaa/);
      expect(onRouteStart.calls.count()).toBe(1);

      router.setLocation('aaa');
      evt = onRouteStart.calls.argsFor(1)[0];

      expect(onRouteStart.calls.count()).toBe(2);
      expect(evt.routes.length).toBe(1);
      expect(evt.routes[0].name).toBe('A2');
    });

    it('should be ignored if given route is already added', function () {
      var router = new Router();
      var onRouteStart = jasmine.createSpy('onRouteStart');
      var evt;

      router.addRoute('A1', /^aa/);
      router.addRoute('B', /^b/);

      router.onRoute = function (evt) {
        if (evt.type === 'routestart') {
          onRouteStart.apply(this, arguments);
        }
      };

      router.setLocation('aa');
      evt = onRouteStart.calls.argsFor(0)[0];

      expect(onRouteStart.calls.count()).toBe(1);
      expect(evt.routes.length).toBe(1);
      expect(evt.routes[0].name).toBe('A1');

      router.addRoute('A1', /^aaa/);
      expect(onRouteStart.calls.count()).toBe(1);

      router.setLocation('aaa');
      expect(onRouteStart.calls.count()).toBe(1);
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

        router.onRoute = function (evt) {
          if (evt.type === 'routechange') {
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
  });

  // @todo повторное добавление роута

  // @todo параметры
  // @todo change только при смене параметров
  // @todo очередь
  // @todo добавление роута в onRoute
});

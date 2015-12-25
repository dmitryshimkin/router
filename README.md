Router
======

Tiny environment agnostic dependency free cross-browser router.

The implementation is based on the following ideas:

- **Environment independence**

  The router is not aware of browser API such as `window.location` or `History API`.
  It uses own internal `location` and provides `getLocation` and `setLocation` methods
  to read and write it. This allows to keep the router's implementation as simple as possible.
  However the router can be easily integrated with `window.location`.

- **Routable components**

  In a typical implementation of the server routing there is only one controller that handles a given location.
  In contrast to the server this router is intended for a client-side SPA and
  supports any number of components that rendered on the same page at the same time according to a given location.

  In general when the router's location is changed there are some components that should be destroyed,
  some components that should be created, and some components that should be updated.

  The router allows you to define a route (the route is just a name and a location pattern),
  and get notifications when this route is started, updated, and stopped.

- **Low level API only**

  The implementation and API should be as simple as possible.
  The router does not provide any integration with browser API out of the box.
  The router does not support any sugar for patterns such as `/product/:id`.
  However all this things can be easily added on a higher level.

- **Performance**

  Small footprint — only **1.28 KB** compressed and gzipped.


## Browser support

All ES3-compliant browsers:

- Firefox
- Chrome
- Safari
- Opera
- IE6+
- Mobile browsers


## Install

Download the latest version:

- [router.js](dist/router.js) – Uncompressed code with comments, 8.39 KB
- [router.min.js](dist/router.min.js) – Compressed, 3.55 KB

or install from NPM or Bower:

```
npm install router
```

```
bower install router
```


## Usage

**Browser**

In a browser include the file in your document:

```html
<script src="path/to/router.min.js"></script>
<script>
  // Here you can use window.Router
</script>
```


**ES6**

```javascript
import {Router} from 'router';
```


**CommonJS**

```javascript
var Router = require('router');
```

**AMD**

```javascript
require(['router'], function (Router) {
  // Here you can you Router
});
```


## API

Create an instance of router:

```javascript
var router = new Router();
```

### Instance methods

#### `getLocation`

Returns current location.

Params: `None`

Example:

```javascript
console.log(router.getLocation()); // undefined

router.setLocation('/books');
console.log(router.getLocation()); // "/books"
```

Returns: `String`


#### `setLocation`

Sets given location as a current router's location and invokes `onRouter` callback
if any routes were updated.

Params:

| Param    | Type   | Description              |
|:---------|:-------|--------------------------|
| location | String | New location. Required.  |

Returns: `void`

Example:

```javascript
router.setLocation('/books');
console.log(router.getLocation()); // "/books"
```

#### `addRoute`

Adds given route to router.

Params:

| Param    | Type   | Description                     |
|:---------|:-------|---------------------------------|
| name     | String | Any string that represents a route. Should be unique for this router instance.   |
| pattern  | RegExp | Pattern that location should match to consider the given route as matching.  |

Returns: `void`

Example:

```javascript
router.addRoute('Books', /^\/books(\?.+)*$/);
router.addRoute('Book', /^\/books\/(d+)(\?.+)*$/);

router.addRoute('Authors', /^\/authors(\?.+)*$/);
router.addRoute('Author', /^\/authors\/(\d+)(\?.+)*$/);
```


#### `onRoute`

This function is called automatically on each location change
if router has routes that were affected.

Params:

| Param    | Type       | Description                       |
|:---------|:-----------|:----------------------------------|
| evt      | RouteEvent | [RouteEvent](#RouteEvent) object  |

Returns: `void`.

Example:

```javascript
router.addRoute('books', /^\/books(\?.+)*$/);
router.addRoute('book', /^\/books\/(d+)(\?.+)*$/);

router.onRoute(function (evt) {
  console.log(evt.type, evt.routes);
});

router.setLocation('/books');
// "routestart", [{ name: "books", params: [] }]

router.setLocation('/books/1');
// "routeend",   [{ name: "books" }]
// "routestart", [{ name: "book", params: ["1"] }]

router.setLocation('/books/2');
// "routestart", [{ name: "book", params: ["2"] }]

router.setLocation('/authors');
// "routeend",   [{ name: "book" }]
```


### Static properties

#### `MAX_REDIRECT_COUNT`

Limit of synchronous redirects count. Default value is `10`.

A synchronous redirect happens when `setLocation` is called from `onRoute` handler.
In some circumstances it might lead to infinite redirects.

`Router.MAX_REDIRECT_COUNT` defines how many consecutive redirects can happen in one event loop.
If the limit is exceeded an error will be thrown. Consider:

```javascript
var redirectCount = 0;

Router.MAX_REDIRECT_COUNT = 120;

router.addRoute('books', /^books$/);
router.addRoute('authors', /^authors$/);

router.onRoute(function (evt) {
  var location = (router.getLocation() === 'books') ? 'authors' : 'books';

  router.setLocation(location);
  redirectCount++;
});

router.setLocation('books'); // Throws error "Too many redirects"
console.log(count);          // 120
```

<a name="RouteEvent"/>
### RouteEvent

Event object that's passed to each `onRoute` callback.

Properties:

| Param    | Type              | Description                       |
|:---------|:------------------|:----------------------------------|
| type     | `String`          | Event type. Possible values: "routestart", "routechange", "routeend"  |
| routes   | `Array.<Object>`  | List of matching routes.          |


## License
Released under the [MIT License](LICENSE)

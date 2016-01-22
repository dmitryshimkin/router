Router
======

Description

## Features


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

- [router.js](dist/router.js) – Uncompressed code with comments, 7.94 KB
- [router.min.js](dist/router.min.js) – Compressed, 3.55 KB

or install from NPM or Bower:

```
npm install router
```

```
bower install router
```


## Usage

### Browser

In a browser include the file in your document:

```html
<script src="path/to/router.min.js"></script>
<script>
  // Here you can use window.Router
</script>
```


#### ES6

```javascript
import {Router} from 'router';
```


#### CommonJS

```javascript
var Router = require('router');
```

#### AMD

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

This function is called on each location change if router has routes that were affected.

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
// "routeend", [{ name: "book" }]
```


### Static properties

#### `MAX_REDIRECT_COUNT`


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

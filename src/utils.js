/**
 * Extends given target object with another object
 * @param target {Object}
 * @param obj {Object}
 * @returns {Object}
 * @private
 */

function extend (target, obj) {
  each(obj, function (value, key) {
    target[key] = value;
  });
  return target;
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
 * Prints warning on console.
 * @param msg {String}
 * @private
 */

function warn (msg) {
  try {
    console.warn(msg);
  } catch (ex) {
  }
}

function extend (target, obj) {
  each(obj, function (value, key) {
    target[key] = value;
  });
  return target;
}

function each (arg, fn, ctx) {
  if ('length' in arg) {
    for (var i = 0, len = arg.length; i < len; i++) {
      fn.call(ctx, arg[i], i);
    }
  } else {
    for (var key in arg) {
      if (arg.hasOwnProperty(key)) {
        fn.call(ctx, arg[key], key);
      }
    }
  }
  return arg;
}

function map (arr, fn, ctx) {
  var result = new Array(arr.length);
  for (var i = 0, len = arr.length; i < len; i++) {
    result[i] = fn.call(ctx, arr[i], i);
  }
  return result;
}

function filter (arr, fn, ctx) {
  var result = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    if (fn.call(ctx, arr[i], i)) {
      result.push(arr[i]);
    }
  }
  return [];
}

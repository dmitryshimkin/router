// ================================================
// Export
// ================================================

if (typeof define === 'function' && define.amd) {
  define('Router', Router); // AMD
} else if (typeof exports === 'object') {
  module.exports = Router; // Node, CommonJS-like
} else {
  win.Router = Router; // Browser globals (root is window)
}

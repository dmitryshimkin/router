// ================================================
// Export
// ================================================

if (typeof define === 'function' && define.amd) {
  define('Router', Router); // AMD
} else if (typeof exports === 'object') {
  module.exports = Router; // Node, CommonJS-like
} else {
  window.Router = Router; // Browser global
}

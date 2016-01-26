'use strict';

var WinLocation = {};

WinLocation.getLocation = function () {
  return window.location.hash.replace('#', '');
};

WinLocation.setLocation = function (location) {
  window.location.hash = location;
};

window.onhashchange = function () {
  if (typeof WinLocation.onChange === 'function') {
    WinLocation.onChange(WinLocation.getLocation());
  }
};

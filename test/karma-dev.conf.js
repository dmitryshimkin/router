module.exports = function(config) {
  require('./karma.conf')(config);

  config.set({
    basePath: '..',
    files: [
      // Source files
      'src/utils.js',
      'src/Route.js',
      'src/RouteEvent.js',
      'src/Router.js',

      // Spec
      'test/spec/router.spec.js'
    ],
    reporters: [
      'progress',
      'coverage'
    ]
  })
};

module.exports = function(config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    files: [
      // Source files
      'src/utils.js',
      'src/Route.js',
      'src/RouteEvent.js',
      'src/Router.js',

      // Spec
      'test/spec/router.spec.js'
    ],
    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-phantomjs-launcher'
    ],
    browsers: [
      'PhantomJS'
    ],
    preprocessors: {
      'src/*.js': ['coverage']
    },
    reporters: [
      'progress',
      'coverage'
    ],
    htmlReporter: {
      outputDir: 'test/report/html/',
      focusOnFailures: true
    },
    coverageReporter: {
      reporters: [
        { type: 'html', dir: './test/coverage' },
        { type: 'text' }
      ]
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO, // LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity
  })
};

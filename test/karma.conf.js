module.exports = function(config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    files: [
      'dist/router.min.js',      // Source files
      'test/spec/router.spec.js' // Spec
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
      'progress'
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
    logLevel: config.LOG_INFO,   // LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity
  })
};

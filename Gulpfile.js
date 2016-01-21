var gulp = require('gulp');
var header = require('gulp-header');
var concat = require('gulp-concat');
var indent = require('gulp-indent');
var rename = require('gulp-rename');
var sizereport = require('gulp-sizereport');
var uglify = require('gulp-uglify');
var wrap = require('gulp-wrap');
var Server = require('karma').Server;

var pkg = require('./package.json');

function getBanner () {
  return [
    '/**',
    ' * Router',
    ' * Version: <%= version %>',
    ' * Author: <%= author %>',
    ' * License: MIT',
    ' * https://github.com/dmitryshimkin/router',
    ' */',
    ''
  ].join('\n')
}

/**
 * Build dist file
 */

gulp.task('scripts', function() {
  var files = [
    'src/utils.js',
    'src/Route.js',
    'src/RouteEvent.js',
    'src/Router.js',
    'src/export.js'
  ];

  return gulp.src(files)
    .pipe(concat('router.js'))
    .pipe(indent())
    .pipe(wrap(';(function (win) {\n  \'use strict\';\n\n<%= contents %>}(this));\n'))
    .pipe(header(getBanner(), pkg))
    .pipe(gulp.dest('./dist/'));
});

/**
 * Create minified version
 */

gulp.task('minify', ['build'], function () {
  return gulp.src('dist/router.js')
    .pipe(uglify({
      mangle: false,
      preserveComments: 'license'
    }))
    .pipe(rename('router.min.js'))
    .pipe(gulp.dest('dist'));
});

/**
 * File size report
 */

gulp.task('report', function () {
  return gulp.src('dist/*')
    .pipe(sizereport({
      gzip: true,
      total: false
    }));
});

/**
 * Build and run test
 */

gulp.task('test:dev', ['build'], function (done) {
  new Server({
    configFile: __dirname + '/test/karma-dev.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('test:prod', ['build'], function (done) {
  new Server({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, done).start();
});

// =============================================================
// Tasks
// =============================================================

gulp.task('build', [
  'scripts'
]);

gulp.task('test', [
  'test:dev'
]);

gulp.task('default', [
  'minify'
]);

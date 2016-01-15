var gulp = require('gulp');
var concat = require('gulp-concat');
var indent = require('gulp-indent');
var rename = require('gulp-rename');
var sizereport = require('gulp-sizereport');
var uglify = require('gulp-uglify');
var wrap = require('gulp-wrap');
var Server = require('karma').Server;

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
    .pipe(gulp.dest('./dist/'));
});

gulp.task('minify', function () {
  return gulp.src('dist/router.js')
    .pipe(uglify())
    .pipe(rename('router.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('report', function () {
  return gulp.src('dist/*')
    .pipe(sizereport({
      gzip: true,
      total: false
    }));
});

gulp.task('test', ['build'], function (done) {
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

gulp.task('default', [
  'build',
  'minify'
]);

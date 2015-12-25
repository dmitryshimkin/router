var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('scripts', function() {
  var files = [
    'src/utils.js',
    'src/Route.js',
    'src/RouteEvent.js',
    'src/Router.js'
  ];

  return gulp.src(files)
    .pipe(concat('router.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('minify', function () {
  return gulp.src('dist/router.js')
    .pipe(uglify())
    .pipe(rename('router.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['scripts']);

gulp.task('default', ['build', 'minify']);

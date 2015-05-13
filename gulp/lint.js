'use strict';

var gulp = require('gulp');
var paths = gulp.paths;
var $ = require('gulp-load-plugins')();

gulp.task('jshint', function() {
  return gulp.src([
      paths.src + '/**/*.js',
      paths.test + '/**/*.js',
    ])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

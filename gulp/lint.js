'use strict';

var gulp = require('gulp');
var paths = gulp.paths;
var $ = require('gulp-load-plugins')();

gulp.task('tslint', function() {
  return gulp.src([
      paths.src + '/**/*.ts',
    ])
    .pipe($.tslint())
    .pipe($.tslint.report('prose', {
      summarizeFailureOutput: true
    }));
});

gulp.task('jshint', function() {
  return gulp.src([
      paths.test + '/**/*.js',
    ])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

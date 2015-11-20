'use strict';

var gulp = require('gulp');
var paths = gulp.paths;
var $ = require('gulp-load-plugins')();

gulp.task('tslint', function() {
  return gulp.src([
      paths.src + '/**/*.ts',
      paths.test + '/**/*.ts',
    ])
    .pipe($.tslint())
    .pipe($.tslint.report('prose', {
      summarizeFailureOutput: true
    }));
});

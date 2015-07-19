'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var mocha = require('gulp-spawn-mocha');

// runs the tests
gulp.task('test', function() {
  return gulp.src(['test/**/*.spec.js'], { read: false })
    .pipe(mocha({
      istanbul: true
    }))
    .on('error', gutil.log);
});

// quick test
gulp.task('t', function() {
  return gulp.src(['test/**/*.spec.js'], { read: false })
    .pipe(mocha({
      istanbul: false
    }))
    .on('error', gutil.log);
});
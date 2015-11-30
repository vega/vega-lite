'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var mocha = require('gulp-spawn-mocha');

// runs the tests
gulp.task('coverage', ['compile-watch'], function() {
  return gulp.src(['test/**/*.test.js'], { read: false })
    .pipe(mocha({
      require: 'source-map-support/register',
      istanbul: true
    }))
    .on('error', gutil.log);
});

// quick test
gulp.task('test', ['compile-watch'],  function() {
  return gulp.src(['test/**/*.test.js'], { read: false })
    .pipe(mocha({
      require: 'source-map-support/register',
      istanbul: false
    }))
    .on('error', gutil.log);
});

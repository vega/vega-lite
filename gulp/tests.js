'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var mocha = require('gulp-spawn-mocha');

// runs the tests
gulp.task('coverage', function() {
  return gulp.src(['test/**/*.test.ts'], { read: false })
    .pipe(mocha({
      require: 'ts-node/register',
      istanbul: true
    }))
    .on('error', gutil.log);
});

// quick test
gulp.task('test', function() {
  return gulp.src(['test/**/*.test.ts'], { read: false })
    .pipe(mocha({
      require: 'ts-node/register',
      istanbul: false
    }))
    .on('error', gutil.log);
});

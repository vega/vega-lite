'use strict';

var gulp = require('gulp');

gulp.paths = {
  src: 'src',
  test: 'test'
};

require('require-dir')('./gulp');

gulp.task('default', ['bundle', 'schema', 'watch-schema', 'watch-test']);
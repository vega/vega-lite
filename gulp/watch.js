'use strict';

var gulp = require('gulp');

// watches for spec schema changes
gulp.task('watch-schema', function() {
    gulp.watch(['src/schema/schema.js'], ['schema']);
});

// watches directories and runs tests if things change
gulp.task('watch-test', function() {
  gulp.watch(['src/**', 'test/**'], ['jshint', 'test']);
});

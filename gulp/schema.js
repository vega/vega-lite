'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// generates vega-lite-schema.json
gulp.task('schema', function () {
  gulp.src('src/schema/schemagen.js')
    .pipe($.run('node', {silent: true, cwd: 'src/schema'}))
    .pipe($.rename('vega-lite-schema.json'))
    .pipe(gulp.dest('.'));
});

gulp.task('instance', ['schema'], function () {
  gulp.src('src/schema/instancegen.js')
    .pipe($.run('node', {silent: true, cwd: 'src/schema'}))
    .pipe($.rename('instance.json'))
    .pipe(gulp.dest('.'));
});

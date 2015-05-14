'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();


function inc(importance) {
    // get all the files to bump version in
    return gulp.src(['./package.json', './bower.json'])
        // bump the version number in those files
        .pipe($.bump({type: importance}))
        // save it back to filesystem
        .pipe(gulp.dest('./'));
}

gulp.task('patch', function() { return inc('patch'); });
gulp.task('feature', function() { return inc('minor'); });
gulp.task('release', function() { return inc('major'); });
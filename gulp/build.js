'use strict';

var gulp = require('gulp');
var paths = gulp.paths;
var $ = require('gulp-load-plugins')();

var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var tsify = require('tsify');

var bundleDef = {
  entries: ['./src/vl.ts'],
  standalone: 'vl',
  debug: true
};

var browserBundler = browserify(bundleDef).plugin(tsify);
var watchBundler = watchify(browserify(bundleDef)).plugin(tsify);

// builds Vega-lite with watcher
function bundle() {
  return build(watchBundler.bundle());
}

function build(bundle) {
  return bundle
    .pipe(source('vega-lite.js'))
    .pipe(buffer())
    .pipe(gulp.dest('.'))
    .pipe($.sourcemaps.init({loadMaps: true}))
    // This will minify and rename to vega-lite.min.js
    .pipe($.uglify())
    .pipe($.rename({ extname: '.min.js' }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('.'))
    .pipe(browserSync.reload({stream:true}));
}

// builds Vega-lite and schema
gulp.task('build', ['schema'], function() {
  build(browserBundler.bundle());
});

watchBundler.on('update', bundle);
gulp.task('bundle', bundle);
gulp.task('compile', function() {
  return gulp.src([
      paths.src + '/**/*.ts',
      paths.test + '/**/*.ts',
      'typings/**/*.d.ts'
    ])
    .pipe($.tsc({sourceMap: true}))
    .pipe(gulp.dest('./'));
});

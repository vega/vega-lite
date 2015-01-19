
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var watchify = require('watchify');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var rename = require('gulp-rename');

var bundler = watchify(browserify({
    entries: ['./src/vl'],
    standalone: 'vl',
    debug: true
  }));


function bundle() {
  return bundler
    .bundle()
    .pipe(source('vegalite.js'))
    .pipe(buffer())
    .pipe(gulp.dest('.'))
    .pipe(sourcemaps.init({loadMaps: true}))
    // This will minify and rename to vegalite.min.js
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('.'));
}

gulp.task('mocha', function() {
    return gulp.src(['test/test-schema.js'], { read: false })  // TODO: add 'test/test.js'
        .pipe(mocha({ reporter: 'list' }))
        .on('error', gutil.log);
});

gulp.task('watch-mocha', function() {
    gulp.watch(['src/**', 'test/**'], ['mocha']);
});

bundler.on('update', bundle);

gulp.task('build', bundle);

gulp.task('default', ['build', 'watch-mocha']);

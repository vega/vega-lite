
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var watchify = require('watchify');


var bundler = watchify(browserify({
    entries: ['./src/vl'],
    exclude: ['d3','topojson', 'lodash', '../lib/vega'],
    debug: true
  }));

function bundle() {
  return bundler
    .bundle()
    .pipe(source('vegalite.js'))
    .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      // Add transformation tasks to the pipeline here.
      // .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('.'));
}

bundler.on('update', bundle);

gulp.task('watch', bundle);
gulp.task('default', ['watch'])


var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('compile', function(){
  var bundler = browserify({
    entries: ['./src/vl'],
    exclude: ['d3','topojson', '../lib/vega'],
    debug: true
  });

  var bundle = function() {
     return bundler
       .bundle()
       .pipe(source('vegalite.js'))
       .pipe(buffer())
       .pipe(sourcemaps.init({loadMaps: true}))
         // Add transformation tasks to the pipeline here.
         // .pipe(uglify())
       .pipe(sourcemaps.write('./'))
       .pipe(gulp.dest('.'));
   };

   return bundle();
});
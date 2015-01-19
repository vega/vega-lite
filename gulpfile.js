
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');
var run = require('gulp-run');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

var bundler = watchify(browserify({
  entries: ['./src/vl'],
  standalone: 'vl',
  debug: true
}));

// builds vegalite
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

// generates spec.json
gulp.task('schema', function () {
  gulp.src('src/schemagen.js')
    .pipe(run('node', {silent: true, cwd: 'src'}))
    .pipe(rename("spec.json"))
    .pipe(gulp.dest('.'))
});

// watches for spec schema changes
gulp.task('watch-schema', function() {
    gulp.watch(['src/schema.js'], ['schema']);
});

// runs the tests
gulp.task('mocha', function() {
  return gulp.src(['test/test-schema.js'], { read: false })  // TODO: add 'test/test.js'
    .pipe(mocha({ reporter: 'list' }))
    .on('error', gutil.log);
});

// watches directories and runs tests if things change
gulp.task('watch-mocha', function() {
  gulp.watch(['src/**', 'test/**'], ['mocha']);
});

bundler.on('update', bundle);

gulp.task('build', bundle);

gulp.task('default', ['build', 'watch-mocha', 'watch-schema']);

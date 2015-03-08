var gulp = require('gulp');

var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var rename = require('gulp-rename');
var run = require('gulp-run');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var watchify = require('watchify');
var browserSync = require('browser-sync');


var gutil = require('gulp-util');
var mocha = require('gulp-spawn-mocha');

var bundleDef = {
  entries: ['./src/vl'],
  standalone: 'vl',
  debug: true
}

var browserBundler = browserify(bundleDef)
var watchBundler = watchify(browserify(bundleDef));

// builds vegalite with watcher
function bundle() {
  return build(watchBundler.bundle());
}

// runs build on the bundle
function build(bundle) {
  return bundle
    .pipe(source('vegalite.js'))
    .pipe(buffer())
    .pipe(gulp.dest('.'))
    .pipe(sourcemaps.init({loadMaps: true}))
    // This will minify and rename to vegalite.min.js
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('.'))
    .pipe(browserSync.reload({stream:true}));
}

// builds vegalite and schema
gulp.task('build', ['schema'], function() {
  build(browserBundler.bundle());
});

// generates spec.json
gulp.task('schema', function () {
  gulp.src('src/schema/schemagen.js')
    .pipe(run('node', {silent: true, cwd: 'src/schema'}))
    .pipe(rename('spec.json'))
    .pipe(gulp.dest('.'));
});

gulp.task('instance', ['schema'], function () {
  gulp.src('src/schema/instancegen.js')
    .pipe(run('node', {silent: true, cwd: 'src/schema'}))
    .pipe(rename('instance.json'))
    .pipe(gulp.dest('.'));
});

// watches for spec schema changes
gulp.task('watch-schema', function() {
    gulp.watch(['src/schema/schema.js'], ['schema']);
});

// runs the tests
gulp.task('mocha', function() {
  return gulp.src(['test/**/*.spec.js'], { read: false })
    .pipe(mocha({
      R: 'list'
    }))
    .on('error', gutil.log);
});

// watches directories and runs tests if things change
gulp.task('watch-mocha', function() {
  gulp.watch(['src/**', 'test/**'], ['mocha']);
});

gulp.task('serve', ['bundle', 'watch-schema', 'watch-mocha'], function() {
    browserSync({
        server: {
            baseDir: './'
        }
    });
});

watchBundler.on('update', bundle);

gulp.task('bundle', bundle);

gulp.task('default', ['bundle', 'schema', 'watch-schema', 'watch-mocha']);

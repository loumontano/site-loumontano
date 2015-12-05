var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var reload = browserSync.reload;


//Development Tasks
//-----------------

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
	.pipe(sass()) //Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

//Watchers
gulp.task('watch', ['sass'], function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

//Optimization Tasks
//------------------

//Optimizing CSS and Javascript
gulp.task('useref', function() {
  var assets = useref.assets();

  return gulp.src('app/*.html')
    .pipe(assets)
    //Minifies CSS only
    .pipe(gulpIf('*.css', minifyCSS()))
    //Minifies JS only
    .pipe(gulpIf('*.js', uglify()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'));
});

//Optimizing Images
gulp.task('images', function() {
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    //Caching imgs
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'));
});

//Copying Fonts
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});


//Cleaning
gulp.task('clean', function() {
  del('dist');
  return cache.clearAll(callback);
});

gulp.task('clean:dist', function(callback) {
  del(['dist/**/*', '!dist/images', '!dist/images/**/*'], callback);
});



//Build
//-----

gulp.task('serve', ['sass','watch','useref','images','fonts'], function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });

});

gulp.task('default', ['serve']);


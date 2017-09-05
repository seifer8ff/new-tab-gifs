// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var concat = require('gulp-concat');
var path = require('path');
var uglify = require('gulp-uglify-es').default;
var stripDebug = require('gulp-strip-debug');
var gulpIf = require('gulp-if');
var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var browserSync = require('browser-sync').create();



// Concatenate & Minify JS & CSS
gulp.task('useref', function(){
  return gulp.src('app/index.html')
  .pipe(useref())
// strips debug and minifies only if it's a JavaScript file
.pipe(gulpIf('*.js', stripDebug()))
.pipe(gulpIf('*.js', uglify()))
.pipe(gulp.dest('dist'))
// Minifies only if it's a CSS file
.pipe(gulpIf('*.css', cssnano()))
.pipe(gulp.dest('dist'))
});

gulp.task('popup-useref', function(){
  return gulp.src('app/popup.html')
  .pipe(useref())
// strips debug and minifies only if it's a JavaScript file
.pipe(gulpIf('*.js', stripDebug()))
.pipe(gulpIf('*.js', uglify()))
.pipe(gulp.dest('dist'))
// Minifies only if it's a CSS file
.pipe(gulpIf('*.css', cssnano()))
.pipe(gulp.dest('dist'))
});

// copy images to dist
gulp.task('images', function(){
  return gulp.src('app/img/**/*.+(png|jpg|gif|svg|pdf)')
  .pipe(gulp.dest('dist/img'))
});

// copy extras to dist
gulp.task('extras', function() {
  return gulp.src('app/*.+(png|xml|ico|json|svg)')
  .pipe(gulp.dest('dist/'))
})

// setup server
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

// Watch Files For Changes and reload browser
gulp.task('watch', ['browserSync'], function() {
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/*.js', browserSync.reload); 
  gulp.watch('app/css/*.css', browserSync.reload); 
});

// build task
gulp.task('build', function() {
  gulp.run('useref'); 
  gulp.run('popup-useref'); 
  // gulp.run('fonts'); 
  gulp.run('extras'); 
  gulp.run('images'); 
});

// Default Task
gulp.task('default', ['watch']);



// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var concat = require('gulp-concat');
var path = require('path');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var browserSync = require('browser-sync').create();



// Concatenate & Minify JS & CSS
gulp.task('useref', function(){
  return gulp.src('app/index.html')
  .pipe(useref())
// strips debug and minifies only if it's a JavaScript file
.pipe(gulpIf('*.js', uglify()))
.pipe(gulp.dest('dist'))
// Minifies only if it's a CSS file
.pipe(gulpIf('*.css', cssnano()))
.pipe(gulp.dest('dist'))
});


// copy fonts to dist
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

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
  // gulp.run('fonts'); 
  gulp.run('extras'); 
  // gulp.run('images'); 
});

// Default Task
gulp.task('default', ['watch']);



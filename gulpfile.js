// Require
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

// Sass
gulp.task('sass', function(){
	return gulp.src('app/sass/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

// Watch files for any changes
gulp.task('watch', ['browserSync', 'sass'], function(){
	gulp.watch('app/sass/**/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function(){
	browserSync.init({
		server: {
			baseDir: 'app'
		}
	})
});

// Concatenates all js scripts in index.html to one file
gulp.task('useref', function(){
	return gulp.src('app/*.html')
		.pipe(useref())
		// Minifies only if its a js file
		.pipe(gulpIf('*.js', uglify()))
		// Minifiefs only if its a css file
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'))
});


// Images
gulp.task('images', function(){
	return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
		// Caching images that ran through imagemin
		.pipe(cache(imagemin({
			interlaced: true
		})))
		.pipe(gulp.dest('dist/images'))
});

// Fonts
gulp.task('fonts', function(){
	return gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))
});

// Clean up generated files
gulp.task('clean:dist', function(){
	return del.sync('dist')
});

// Build
gulp.task('build', function(callback){
	runSequence('clean:dist',
		['sass', 'useref', 'images', 'fonts']),
	callback
});

gulp.task('default', function(callback){
	runSequence(['sass', 'browserSync', 'watch']),
	callback
});
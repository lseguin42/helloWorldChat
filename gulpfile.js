var gulp       = require('gulp');
var watch      = require('gulp-watch');
var inject     = require('gulp-inject'); 
var bowerFiles = require('main-bower-files');

var srcs = [
	'app.js',
	'views/**/*.{js,css}',
	'directives/**/*.{js,css}',
	'services/**/*.js',
	'filters/**/*.js'
];

gulp.task('inject', function () {
    return gulp.src('index.html')
        .pipe(inject(gulp.src(bowerFiles(), { read: false }), {
	    	name: 'bower',
	    	addRootSlash: false
		}))
        .pipe(inject(gulp.src(srcs, { read: false }), {
	    	addRootSlash: false
		}))
        .pipe(gulp.dest('.'));
});

gulp.task('watch', ['inject'], function () {
    /**
     * On add new dependencies Bower
     */
    gulp.watch('bower.json', function () {
		gulp.start('inject');
    });
    
    /**
	 * event sources
	 */
	watch(srcs, {events: ['add', 'unlink'] }, function () {
		gulp.start('inject');
	});
});

gulp.task('default', ['watch']);
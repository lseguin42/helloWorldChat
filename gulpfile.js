var gulp       = require('gulp');
var watch      = require('gulp-watch');
var inject     = require('gulp-inject'); 
var bowerFiles = require('main-bower-files');
var filter     = require('gulp-filter');
var concat     = require('gulp-concat');
var uglify     = require('gulp-uglify');
var debug      = require('gulp-debug');
var cssmin     = require('gulp-cssmin');
var os         = require('os');
var open       = require('gulp-open');
var rev        = require('gulp-rev');
var angularTemplateCache = require('gulp-angular-templatecache');

var srcs = [
	'app.js',
	'views/**/*.{js,css}',
	'directives/**/*.{js,css}',
	'services/**/*.js',
	'filters/**/*.js'
];
var templates = [
	'views/**/*.html',
	'directives/**/*.html'
];
var others = [
	'images{,/*}'
]

var browserConfig = null;

var browser = os.platform() === 'linux' ? 'google-chrome' : (
 			  os.platform() === 'darwin' ? 'google chrome' : 'chrome');

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

/**
 * 
 */
gulp.task('preview', function () {
	browserConfig = { app: browser };
	return gulp.start('build');
});

/**
 * 
 */
gulp.task('build', function () {

	var filterViews      = filter('views/**/*.html',      { restore: true });
	var filterDirectives = filter('directives/**/*.html', { restore: true });
	var filterJs         = filter('**/*.js',              { restore: true });
	var filterCss        = filter('**/*.css',             { restore: true });
	
	var filterInjected   = filter('**/*.{css,js}',        { restore: false });

	var files  = bowerFiles()
				 .concat(srcs)
				 .concat(templates)
				 .concat(others);
	
	var injected = gulp.src(files)
		.pipe(filterViews)
			.pipe(debug({title: 'views'}))
			.pipe(angularTemplateCache({
				root: 'views',
				module: 'helloWorldChat'
			}))
		.pipe(filterViews.restore)
		.pipe(filterDirectives)
			.pipe(debug({title: 'directives'}))
			.pipe(angularTemplateCache({
				root: 'directives',
				module: 'helloWorldChat'
			}))
		.pipe(filterDirectives.restore)
		.pipe(filterCss)
			.pipe(debug({title: 'css'}))
			.pipe(concat('style.css'))
			.pipe(cssmin())
			.pipe(debug({title: 'cssmin'}))
			.pipe(rev())
			.pipe(debug({title: 'revcss'}))
		.pipe(filterCss.restore)
		.pipe(filterJs)
			.pipe(debug({title: 'javascript'}))
			.pipe(concat('app.js'))
			.pipe(uglify())
			.pipe(debug({title: 'uglify'}))
			.pipe(rev())
			.pipe(debug({title: 'revjs'}))
		.pipe(filterJs.restore)
		.pipe(debug({title: 'build'}))
		.pipe(gulp.dest('dist'))
		.pipe(filterInjected)
			.pipe(debug({ title: 'inject' }));

	var app = gulp.src('index.html')
		.pipe(inject(injected, {
			name: 'build',
			ignorePath: 'dist/',
			addRootSlash: false,
			starttag: '<!-- {{name}}:{{ext}} -->',
			endtag: '<!-- endbuild -->'
		}))
		.pipe(debug({title: 'index'}))
		.pipe(gulp.dest('dist'));
	
	if (browserConfig)
		return app.pipe(open(browserConfig));
	return app;
});

gulp.task('default', ['watch']);
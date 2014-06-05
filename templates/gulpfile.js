"use strict";

var gulp = require('gulp');
var connect = require('connect');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');
var karma = require('karma' ).server;
var gulpKarma = require('gulp-karma');
var jshint = require('gulp-jshint');
var args = require('yargs').argv;

var isDebug = args.debug;
var enableJSReload = args.jsreload;

// Files and folders
var appFolder = 'app';
var jsFolder = appFolder + "/src";
var publicFolder = appFolder + "/public";
var stylesFolder = appFolder + "/styles";

var jsFiles = [
  jsFolder + "/**/*.js"
];
var testFiles = [
  'test/unit/*-spec.js'
];

// Ports
var localPort = args.port ? args.port : 7770;
var livereloadPort = args.lp ? args.lp : 35729;

// Start local server
gulp.task('server', function() {
  var app = connect();

  app.use(require('connect-livereload' )({
    port: livereloadPort
  }));

  app.use(connect.static(publicFolder));
  app.listen(localPort);

  console.log("\nStarting server at: http://localhost:" + localPort + "/\n");
});

// Compile sass
gulp.task('sass', function() {
  gulp.src(stylesFolder + '/main.scss' )
    .pipe(sass({
      outputStyle: [ 'expanded' ],
      sourceComments: 'normal',
      errLogToConsole: true
    }))
    .pipe(prefix())
    .pipe(gulp.dest(publicFolder));
});

gulp.task('lint', function() {
  return gulp.src(jsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * CI tests
 *
 * Uses `gulp-karma` instead of normal karma so
 * that it fails correctly
 */
gulp.task('test:ci', function() {
  // Be sure to return the stream
  return gulp.src(testFiles)
    .pipe(gulpKarma({
      browsers: ['PhantomJS'],
      frameworks: ['jasmine'],
      files: testFiles,

      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task('test', function(done) {
  var karmaCommonConf = {
    browsers: isDebug ? ['Chrome'] : ['PhantomJS'],
    frameworks: ['jasmine'],
    files: testFiles
  };

  karma.start(karmaCommonConf, done);
});

gulp.task('watch', function(done) {
  var server = livereload();

  gulp.watch([
    publicFolder + '/**/*.html',
    publicFolder + '/**/*.css'
  ])
  .on('change', function(file) {
    server.changed(file.path);
  });

  gulp.watch(stylesFolder + '/**/*.scss', [
    'sass'
  ]);

  gulp.watch(jsFiles, [
    'lint',
    'test'
  ]).on('change', function(file) {
    server.changed(file.path);
  });
});

// Default task
gulp.task('default', [
  'server',
  'watch'
]);
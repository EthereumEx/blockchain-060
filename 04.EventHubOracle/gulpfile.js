'use strict';

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var plumber = require('gulp-plumber');
var eslint = require('gulp-eslint');


gulp.task('default', [
  'develop'
]);

gulp.task('build', [
  'lint'
]);

gulp.task('develop', function() {
  process.env.DEBUG = 'oracle-demo';
  process.env.ENV = 'development';

  nodemon({
    script: 'app.js',
    stdout: true,
    stderr: true
  });
});

gulp.task('lint', function() {
  return gulp.src(['**/*.js','!node_modules/**', '!contracts/**'])
    .pipe(eslint({
      configFile: '.eslintrc'
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

'use strict';

var gulp = require('gulp');

require('require-dir')('./gulp');

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

var deploy = require('gulp-gh-pages');

gulp.task('deploy', function () {
  return gulp.src('./dist/**/*')
    .pipe(deploy());
});

'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var watch = require('./index');
var grep = require('gulp-grep-stream');

// require('longjohn');

gulp.task('watch', function () {
    gulp.src(['test/*.js', 'index.js'], { read: false })
        .pipe(watch())
        .pipe(grep('**/test/*.js'))
        .pipe(mocha({ timeout: 5000, reporter: 'spec' }))
        .on('error', function (err) {
            if (!/tests? failed/.test(err.stack)) {
                console.log(err.stack);
            }
        });
});

gulp.task('default', function (cb) {
    gulp.run('watch', cb);
});

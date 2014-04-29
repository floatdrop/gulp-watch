/* global describe, it */
'use strict';

delete require.cache[require.resolve('..')];

var gulp = require('gulp'),
    watch = require('..'),
    utils = require('./utils');

require('should');

describe('array of tasks', function () {
    it('should accept array of tasks to be executed', function (done) {
        var options = utils.defaults();
        var watcher = gulp.src(options.src).pipe(watch(options, ['done']));
        gulp.task('done', function () {
            watcher.on('end', done);
            watcher.close();
        });
    });

    it('should call task on gaze event', function (done) {
        var options = utils.defaults();
        options.passThrough = false;
        var watcher = gulp.src(options.src).pipe(watch(options, ['done']));
        gulp.task('done', function () {
            watcher.on('end', done);
            watcher.close();
        });
        watcher.on('finish', utils.touch('test/fixtures/test.js'));
    });

    it('should call multiple tasks on gaze event', function (done) {
        var options = utils.defaults();
        options.passThrough = false;
        var watcher = gulp.src(options.src).pipe(watch(options, ['one', 'two']));
        var result = '';
        gulp.task('one', function () {
            result = '1';
        });
        gulp.task('two', function () {
            result.should.eql('1');
            watcher.on('end', done);
            watcher.close();
        });
        watcher.on('finish', utils.touch('test/fixtures/test.js'));
    });
});

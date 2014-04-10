/* global describe, it, beforeEach, afterEach */
'use strict';

delete require.cache[require.resolve('..')];

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    watch = require('..'),
    touchFiles = require('./utils').touchFiles,
    path = require('path');

describe('file.event attribute', function () {

    beforeEach(function (done) {
        require('rimraf')('temp', done);
    });

    function task(options) {
        options = options || {};
        options.timeout = options.timeout || 0;
        options.glob = 'test/fixtures/**/*.scss';
        options.silent = options.silent || true;

        var w = watch(options);

        return {
            watch: w,
            stream: w
                .pipe(sass())
                .pipe(gulp.dest('temp'))
        };
    }

    it('should add event property for changed files', function (done) {
        gulp.task('default', function () {
            var t = task({ emitOnGlob: false });
            t.watch.on('ready', touchFiles.bind(null, 'test/fixtures/scss/variables.scss', null));
            t.watch.on('data', function (file) {
                file.should.have.property('event', 'changed');
                t.watch.on('end', done);
                t.watch.close();
            });
            return t.stream;
        });

        gulp.run('default');
    });

    it('should not add event property for `emitOnGlob`', function (done) {
        gulp.task('default', function () {
            var t = task();
            t.watch.on('data', function (file) {
                file.should.not.have.property('event');
            });
            t.watch.on('ready', function () {
                t.watch.on('end', done);
                t.watch.close();
            });
            return t.stream;
        });

        gulp.run('default');
    });

    it('should not add event property for all files with `emit: all`', function (done) {
        gulp.task('default', function () {
            var t = task({ emitOnGlob: false, emit: 'all' });
            t.watch.on('ready', touchFiles.bind(null, 'test/fixtures/scss/variables.scss', function () {
                setTimeout(function () {
                    t.watch.on('end', done);
                    t.watch.close();
                }, 1000);
            }));
            t.watch.on('data', function (file) {
                if (file.path === path.resolve('test/fixtures/scss/variables.scss')) {
                    file.should.have.property('event', 'changed');
                } else {
                    file.should.not.have.property('event');
                }
            });
            return t.stream;
        });

        gulp.run('default');
    });
});

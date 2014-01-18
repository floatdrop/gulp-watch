/* global describe, it, beforeEach, afterEach */
'use strict';

delete require.cache[require.resolve('..')];

var hashdir = require('hashdir'),
    async = require('async'),
    should = require('should');

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    watch = require('..'),
    touchFiles = require('./utils').touchFiles;

describe('glob mode example', function () {

    beforeEach(function (done) {
        console.log();
        require('rimraf')('temp', done);
    });

    function task(options) {
        options = options || {};
        options.timeout = options.timeout || 0;
        options.glob = 'test/fixtures/**/*.scss';
        var w = watch(options);

        return {
            watch: w,
            stream: w
                .pipe(sass())
                .pipe(gulp.dest('temp'))
        };
    }

    it('should work', function (done) {
        gulp.task('default', function () {
            var t = task();
            t.watch.on('ready', function () {
                t.watch.on('end', done);
                t.watch.close();
            });
            return t.stream;
        });

        gulp.run('default');
    });

    it('should work with emitOnGlob === false', function (done) {
        gulp.task('default', function () {
            var t = task({ emitOnGlob: false });
            t.watch.on('ready', touchFiles.bind(null, 'test/fixtures/scss/*.scss', function () {
                setTimeout(function () {
                    t.watch.on('end', done);
                    t.watch.close();
                }, 1000);
            }));
            return t.stream;
        });

        gulp.run('default');
    });

    it('should work with passThrough === false && emit === `all`', function (done) {
        gulp.task('default', function () {
            var t = task({ emitOnGlob: false, emit: 'all' });
            t.watch.on('ready', touchFiles.bind(null, 'test/fixtures/scss/_cats.scss', function () {
                setTimeout(function () {
                    t.watch.on('end', done);
                    t.watch.close();
                }, 1000);
            }));
            return t.stream;
        });

        gulp.run('default');
    });

    afterEach(function (done) {
        var path = require('path');
        async.parallel({
            actual: hashdir.bind(hashdir, path.join(__dirname, '../temp/scss')),
            expected: hashdir.bind(hashdir, path.join(__dirname, 'expected/css')),
        }, function (err, result) {
            should.not.exist(err);
            result.actual.should.eql(result.expected);
            done();
        });
    });
});

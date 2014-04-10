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

describe('batching mode example', function () {

    beforeEach(function (done) {
        require('rimraf')('temp', done);
    });

    function task(options) {
        options = options || {};
        options.timeout = options.timeout || 0;
        options.silent = options.silent || true;

        return gulp.src('test/fixtures/scss/*.scss')
            .pipe(watch(options, function (files) {
                return files
                    .pipe(sass())
                    .pipe(gulp.dest('temp/css'));
            }));
    }

    it('should work', function (done) {
        gulp.task('default', function () {
            var watcher = task();
            watcher.on('finish', function () {
                watcher.on('end', done);
                watcher.close();
            });
            return watcher;
        });

        gulp.run('default');
    });

    it('should work with passThrough === false', function (done) {
        gulp.task('default', function () {
            var watcher = task({ passThrough: false });
            watcher.on('finish', touchFiles.bind(null, 'test/fixtures/scss/*.scss', function () {
                setTimeout(function () {
                    watcher.on('end', done);
                    watcher.close();
                }, 1000);
            }));
            return watcher;
        });

        gulp.run('default');
    });

    it('should work with passThrough === false && emit === `all`', function (done) {
        gulp.task('default', function () {
            var watcher = task({ passThrough: false, emit: 'all' });
            watcher.on('finish', touchFiles.bind(null, 'test/fixtures/scss/_cats.scss', function () {
                setTimeout(function () {
                    watcher.on('end', done);
                    watcher.close();
                }, 1000);
            }));
            return watcher;
        });

        gulp.run('default');
    });

    afterEach(function (done) {
        var path = require('path');
        async.parallel({
            actual: hashdir.bind(hashdir, path.join(__dirname, '../temp/css')),
            expected: hashdir.bind(hashdir, path.join(__dirname, 'expected/css')),
        }, function (err, result) {
            should.not.exist(err);
            result.actual.should.eql(result.expected);
            done();
        });
    });
});

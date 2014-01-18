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

describe('per-file building', function () {

    beforeEach(function (done) {
        console.log();
        require('rimraf')('temp', done);
    });

    function task(options) {
        options = options || {};
        options.timeout = options.timeout || 0;

        var w = watch(options);

        return {
            watch: w,
            stream: gulp.src('test/fixtures/scss/*.scss')
                .pipe(w)
                .pipe(sass())
                .pipe(gulp.dest('temp/css'))
        };
    }


    it('should work', function (done) {
        gulp.task('default', function () {
            var t = task({ passThrough: false });
            t.watch.on('finish', touchFiles.bind(null, 'test/fixtures/scss/variables.scss', function () {
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
            actual: hashdir.bind(hashdir, path.join(__dirname, '../temp/css')),
            expected: hashdir.bind(hashdir, path.join(__dirname, 'expected/per-file')),
        }, function (err, result) {
            should.not.exist(err);
            result.actual.should.eql(result.expected);
            done();
        });
    });
});

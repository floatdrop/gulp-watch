/* global describe, it, beforeEach, afterEach */
'use strict';

var watch = require('..'),
    path = require('path'),
    should = require('should'),
    gulp = require('gulp');

describe('logging', function () {
    beforeEach(function() { console.log(); })

    it('should work when verbose is true', function (done) {
        var w = gulp.src('test/fixtures/test.js').pipe(watch({ verbose: true, silent: false }))
        w.on('finish', function () {
            w.on('end', done);
            w.close();
        });
    });

    it('should work when name is specified', function (done) {
        var w = gulp.src('test/fixtures/test.js').pipe(watch({ name: 'Test', verbose: true, silent: false }))
        w.on('finish', function () {
            w.on('end', done);
            w.close();
        });
    });
});

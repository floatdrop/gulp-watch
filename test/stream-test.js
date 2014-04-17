/* global describe, it*/
'use strict';

delete require.cache[require.resolve('..')];


var gulp = require('gulp'),
    watch = require('..'),
    utils = require('./utils');

require('should');

describe('streaming', function () {

    it('should pass through files from src', function (done) {
        var options = utils.defaults();
        var i = 0;
        gulp.src(options.src)
            .pipe(watch(options))
            .on('data', function () {
                i ++;
                if (i === 2) { done(); }
            });
    });

    it('should emit only changed files when passThrough is false', function (done) {
        var options = utils.defaults({ passThrough: false });
        var i = 0;
        gulp.src(options.src)
            .pipe(watch(options))
            .on('data', function () {
                i ++;
                if (i >= 1) { done(); }
            })
            .on('finish', utils.touch('test/fixtures/test.js'));
    });
});

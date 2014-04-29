/* global describe, it */
'use strict';

delete require.cache[require.resolve('..')];

var gulp = require('gulp'),
    watch = require('..'),
    utils = require('./utils'),
    should = require('should');

describe('batching mode', function () {

    it('should batch file objects', function (done) {
        var options = utils.defaults();
        var watcher = gulp.src(options.src)
            .pipe(watch(options, function (files) {
                files.pipe(utils.es.writeArray(function (err, arr) {
                    should.exist(arr);
                    arr.should.have.length(2);
                    watcher.on('end', done);
                    watcher.close();
                }));
            }));
    });

    it('should batch file single changed file', function (done) {
        var options = utils.defaults();
        options.passThrough = false;
        var watcher = gulp.src(options.src)
            .pipe(watch(options, function (files) {
                files.pipe(utils.es.writeArray(function (err, arr) {
                    should.exist(arr);
                    arr.should.have.length(1);
                    watcher.on('end', done);
                    watcher.close();
                }));
            }));
        watcher.on('finish', utils.touch('test/fixtures/test.js'));
    });

});

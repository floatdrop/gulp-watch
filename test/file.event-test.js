/* global describe, it, beforeEach, afterEach */
'use strict';

delete require.cache[require.resolve('..')];

var gulp = require('gulp'),
    watch = require('..'),
    utils = require('./utils'),
    path = require('path'),
    fs = require('fs');

var should = require('should');

describe('file.event attribute', function () {

    it('should emit deleted event', function (done) {
        fs.writeFileSync('test/fixtures/_tobedeleted.js', 'To be deleted');
        var options = utils.defaults({ passThrough: false });
        var watcher = gulp.src(options.src).pipe(watch(options));
        watcher.on('data', function (file) {
            file.should.have.property('event', 'deleted');
            file.isNull().should.be.ok;
            watcher.on('end', done);
            watcher.close();
        });
        watcher.on('finish', function () { fs.unlinkSync('test/fixtures/_tobedeleted.js'); });
    });

    it('should add event property for changed files', function (done) {
        var options = utils.defaults({ passThrough: false });
        var watcher = gulp.src('test/fixtures/test.js').pipe(watch(options));
        watcher.on('data', function (file) {
            file.should.have.property('event', 'changed');
            watcher.on('end', done);
            watcher.close();
        });
        watcher.on('finish', utils.touch('test/fixtures/test.js'));
    });

    it('should not add event property for `emitOnGlob`', function (done) {
        var options = utils.defaults({ glob: 'test/fixtures/*', emitOnGlob: true });
        var i = 0;
        var watcher = watch(options)
            .on('data', function (file) {
                i ++;
                should(file.event).be.not.ok;
                if (i === 2) {
                    watcher.on('end', done);
                    watcher.close();
                }
            });
    });

    it('should not add event property for all files with `emit: all`', function (done) {
        var options = utils.defaults({ emit: 'all', passThrough: false });
        var watcher = gulp.src(options.src).pipe(watch(options));
        var i = 0;
        watcher.on('data', function (file) {
            i ++;
            if (file.path === path.resolve('test/fixtures/test.js')) {
                file.should.have.property('event', 'changed');
            } else {
                file.should.not.have.property('event');
            }
            if (i === 2) {
                watcher.on('end', done);
                watcher.close();
            }
        });
        watcher.on('finish', utils.touch('test/fixtures/test.js'));
    });
});

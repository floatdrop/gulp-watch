/* global describe, it */
'use strict';

delete require.cache[require.resolve('..')];

var gulp = require('gulp'),
    watch = require('..'),
    utils = require('./utils');

require('should');

describe('globs', function () {

    it('should accept glob', function (done) {
        var options = utils.defaults({ glob: 'test/fixtures/*' });
        var watcher = watch(options, function (files) {
            files.pipe(utils.es.writeArray(function (err, arr) {
                arr.should.have.length(3);
                watcher.on('end', done);
                watcher.close();
            }));
        });
    });

    it('should not emit files at start with emitOnGlob is false', function (done) {
        var options = utils.defaults({ glob: 'test/fixtures/*', emitOnGlob: false });
        var watcher = watch(options, function (files) {
            files.pipe(utils.es.writeArray(function (err, arr) {
                arr.should.have.length(1);
                watcher.on('end', done);
                watcher.close();
            }));
        });
        watcher.on('ready', utils.touch('test/fixtures/test.js'));
    });

    it('should emit all files when emit equals `all`', function (done) {
        var options = utils.defaults({ glob: 'test/fixtures/*', emitOnGlob: false, emit: 'all' });
        var watcher = watch(options, function (files) {
            files.pipe(utils.es.writeArray(function (err, arr) {
                arr.should.have.length(3);
                watcher.on('end', done);
                watcher.close();
            }));
        });
        watcher.on('ready', utils.touch('test/fixtures/test.js'));
    });

    it('should use base path for files from glob', function (done) {
        var options = utils.defaults({ glob: 'test/fixtures/*', emitOnGlob: false, base: 'test' });
        var watcher = watch(options);
        watcher.on('data', function (file) {
            file.base.should.eql('test');
            watcher.on('end', done);
            watcher.close();
        });
        watcher.on('ready', utils.touch('test/fixtures/test.js'));
    });

    it('should use the passed gaze options', function (done) {
        var options = utils.defaults({
                glob: 'sub/*',
                gaze: {
                    cwd: 'test/fixtures/'
                }
            });

        var watcher = watch(options);

        watcher.on('data', function (file) {
            file.base.should.endWith('sub/');
            file.path.should.endWith('1');
            watcher.on('end', done);
            watcher.close();
        });
        watcher.on('ready', utils.touch('test/fixtures/sub/1'));
    });

});

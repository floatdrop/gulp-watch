/* global describe, it */
'use strict';

var watch = require('..'),
    path = require('path'),
    should = require('should'),
    gaze = require('gaze');

describe('getWatchedFiles', function () {
    it('should return single file in array', function (done) {
        gaze('test/fixtures/test.js', function (err, watcher) {
            if (err) { return done(err); }
            watch.getWatchedFiles(watcher, function (err, files) {
                if (err) { return done(err); }
                files.should.have.length(1);
                done();
            });
        });
    });

    it('should return multilple files in array', function (done) {
        gaze('test/fixtures/*', function (err, watcher) {
            if (err) { return done(err); }
            watch.getWatchedFiles(watcher, function (err, files) {
                if (err) { return done(err); }
                files.should.have.length(2);
                done();
            });
        });
    });

    it('should return flatten _watched structure', function (done) {
        gaze('test/**/*', function (err, watcher) {
            if (err) { return done(err); }
            watch.getWatchedFiles(watcher, function (err, files) {
                if (err) { return done(err); }
                files.length.should.be.greaterThan(5);
                done();
            });
        });
    });
});

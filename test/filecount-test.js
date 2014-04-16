/* global describe, it */
'use strict';

var watch = require('..'),
    path = require('path'),
    should = require('should'),
    gaze = require('gaze');

describe('fileCount', function () {
    it('should return valid message for single file', function (done) {
        gaze('test/fixtures/test.js', function (err, watcher) {
            if (err) { return done(err); }
            watch.fileCount(watcher, function (err, msg) {
                msg.should.eql('1 file');
                done();
            });
        });
    });

    it('should return valid message for multiple files', function (done) {
        gaze('test/fixtures/*', function (err, watcher) {
            if (err) { return done(err); }
            watch.fileCount(watcher, function (err, msg) {
                msg.should.eql('2 files');
                done();
            });
        });
    });
});

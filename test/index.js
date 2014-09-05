/* global describe, it */

var assert = require('stream-assert');
var watch = require('..');
var join = require('path').join;
var touch = require('./touch.js');
require('should');

function fixtures(glob) {
    return join(__dirname, 'fixtures', glob);
}

describe('watch', function () {
    it('should throw on invalid glob argument', function () {
        (function() { watch(); }).should.throw();
        (function() { watch(1); }).should.throw();
        (function() { watch({}); }).should.throw();
    });

    it('should emit ready and end', function (done) {
        var w = watch(fixtures('*.js'));
        w.on('ready', function () {
            w.on('end', done);
            w.close();
        });
    });

    it('should emit changed file', function (done) {
        var w = watch(fixtures('*.js'));
        w.on('ready', touch(fixtures('index.js')))
        .on('data', function (file) {
            file.relative.should.eql('index.js');
            file.event.should.eql('changed');
            w.on('end', done);
            w.close();
        });
    });

    it('should emit changed file with stream contents', function (done) {
        var w = watch(fixtures('*.js'), { buffer: false });
        w.on('ready', touch(fixtures('index.js')))
        .on('data', function (file) {
            file.contents.should.have.property('readable', true);
            w.on('end', done);
            w.close();
        });
    });

    it('should emit changed file with stats', function (done) {
        var w = watch(fixtures('*.js'), { buffer: false });
        w.on('ready', touch(fixtures('index.js')))
        .on('data', function (file) {
            file.should.have.property('stat');
            w.on('end', done);
            w.close();
        });
    });

    it('should call callback on file event', function (done) {
        var w = watch(fixtures('*.js'), function (files) {
            files
                .pipe(assert.first(function (file) {
                    file.relative.should.eql('index.js');
                    file.event.should.eql('changed');
                }))
                .on('end', function (err) {
                    w.on('end', done.bind(null, err));
                    w.close();
                });
        });
        w.on('ready', touch(fixtures('index.js')));
    });
});

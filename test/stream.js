/* global describe, it */

var watch = require('..');
var join = require('path').join;
var touch = require('./touch.js');
require('should');

function fixtures(glob) {
    return join(__dirname, 'fixtures', glob);
}

describe('stream', function () {
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
});

/* global describe, it, afterEach */

var watch = require('..');
var join = require('path').join;
var touch = require('./touch.js');
var rimraf = require('rimraf');
require('should');

function fixtures(glob) {
    return join(__dirname, 'fixtures', glob);
}

describe.only('stream', function () {
    var w;

    afterEach(function (done) {
        w.on('end', done);
        w.close();
    });

    it('should emit ready and end', function (done) {
        w = watch(fixtures('*.js'));
        w.on('ready', function () { done(); });
    });

    it('should emit added file', function (done) {
        w = watch(fixtures('*.js'));
        w.on('ready', touch(fixtures('new.js')))
        .on('data', function (file) {
            file.relative.should.eql('new.js');
            file.event.should.eql('added');
            done();
        });
        w.on('end', function () {
            rimraf.sync(fixtures('new.js'));
        });
    });

    it('should emit changed file', function (done) {
        w = watch(fixtures('*.js'));
        w.on('ready', touch(fixtures('index.js')))
        .on('data', function (file) {
            file.relative.should.eql('index.js');
            file.event.should.eql('changed');
            done();
        });
    });

    it('should emit changed file with stream contents', function (done) {
        w = watch(fixtures('*.js'), { buffer: false });
        w.on('ready', touch(fixtures('index.js')))
        .on('data', function (file) {
            file.contents.should.have.property('readable', true);
            done();
        });
    });

    it('should emit changed file with stats', function (done) {
        w = watch(fixtures('*.js'), { buffer: false });
        w.on('ready', touch(fixtures('index.js')))
        .on('data', function (file) {
            file.should.have.property('stat');
            done();
        });
    });
});

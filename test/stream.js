/* global describe, it, afterEach */

var watch = require('..');
var join = require('path').join;
var touch = require('./touch.js');
var fs = require('fs');
var rimraf = require('rimraf');
require('should');

function fixtures(glob) {
    return join(__dirname, 'fixtures', glob);
}

describe('stream', function () {
    var w;

    afterEach(function (done) {
        w.on('end', function () {
            rimraf.sync(fixtures('new.js'));
            done();
        });
        w.close();
    });

    it('should emit ready and end', function (done) {
        w = watch(fixtures('*.js'));
        w.on('ready', function () { done(); });
    });

    it('should emit added file', function (done) {
        w = watch('test/fixtures/*.js');
        w.on('data', function (file) {
            file.relative.should.eql('new.js');
            file.event.should.eql('add');
            done();
        }).on('ready', touch(fixtures('new.js')));
    });

    it('should emit change event on file change', function (done) {
        w = watch(fixtures('*.js'));
        w.on('ready', touch(fixtures('index.js')));
        w.on('data', function (file) {
            file.relative.should.eql('index.js');
            done();
        });
    });

    it('should emit changed file with stream contents', function (done) {
        w = watch(fixtures('*.js'), { buffer: false });
        w.on('data', function (file) {
            file.contents.should.have.property('readable', true);
            done();
        }).on('ready', touch(fixtures('index.js')));
    });

    it('should emit changed file with stats', function (done) {
        w = watch(fixtures('*.js'), { buffer: false });
        w.on('data', function (file) {
            file.should.have.property('stat');
            done();
        }).on('ready', touch(fixtures('index.js')));
    });

    it('should emit deleted file with stats', function (done) {
        touch(fixtures('created.js'), function () {
            w = watch(fixtures('**/*.js'), { buffer: false });
            w.on('data', function (file) {
                file.should.have.property('contents', null);
                done();
            }).on('ready', function () {
                fs.unlinkSync(fixtures('created.js'));
            });
        })();
    });
});

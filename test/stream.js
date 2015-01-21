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
            file.relative.should.eql('index.js');
            file.event.should.eql('add');
            done();
        });
    });

    it('should emit change event on file change', function (done) {
        w = watch(fixtures('*.js'));
        w.on('ready', touch(fixtures('index.js')));
        w.on('data', function (file) {
            if (file.event === 'change') {
                file.relative.should.eql('index.js');
                done();
            }
        });
    });

    it('should emit changed file with stream contents', function (done) {
        w = watch(fixtures('*.js'), { buffer: false });
        w.on('data', function (file) {
            if (file.event === 'add') {
                touch(fixtures('index.js'))();
            }
            if (file.event === 'change') {
                file.contents.should.have.property('readable', true);
                done();
            }
        });
    });

    it('should emit changed file with stats', function (done) {
        w = watch(fixtures('*.js'), { buffer: false });
        w.on('data', function (file) {
            if (file.event === 'add') {
                touch(fixtures('index.js'))();
            }
            if (file.event === 'change') {
                file.should.have.property('stat');
                done();
            }
        });
    });

    it('should emit deleted file with stats', function (done) {
        touch(fixtures('created.js'), function () {
            w = watch(fixtures('*.js'), { buffer: false });
            w.on('data', function (file) {
                if (file.event === 'add' && file.relative === 'created.js') {
                    fs.unlinkSync(fixtures('created.js'));
                }

                if (file.event === 'unlink') {
                    file.should.have.property('contents', null);
                    done();
                }
            });
        })();
    });
});

/* global describe, it, afterEach */

var assert = require('stream-assert');
var watch = require('..');
var join = require('path').join;
var touch = require('./touch.js');
require('should');

function fixtures(glob) {
    return join(__dirname, 'fixtures', glob);
}

describe('callback', function () {
    var w;

    afterEach(function (done) {
        w.on('end', done);
        w.close();
    });

    it('should be called on event', function (done) {
        w = watch(fixtures('*.js'), function (files) {
            files
                .pipe(assert.first(function (file) {
                    file.relative.should.eql('index.js');
                    file.event.should.eql('changed');
                }))
                .pipe(assert.end(done));
        });
        w.on('ready', touch(fixtures('index.js')));
    });

    it('should be called after some data is piped in', function (done) {
        w = watch(fixtures('*.js'), function (files) {
            files
                .on('data', function (file) {
                    console.log(file);
                    if (file === 1) { return; }
                    file.relative.should.eql('index.js');
                    file.event.should.eql('changed');
                    done();
                });
        });
        w.end(1);
        w.on('ready', touch(fixtures('index.js')));
    });
});

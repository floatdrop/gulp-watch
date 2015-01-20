/* global describe, it, afterEach */

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

    it('should be called on add event', function (done) {
        w = watch(fixtures('*.js'), function (file) {
            file.relative.should.eql('index.js');
            file.event.should.eql('add');
            done();
        });
    });

    it('should be called on add event', function (done) {
        w = watch(fixtures('*.js'), function (file) {
            if (file.event === 'add') {
                touch(fixtures('index.js'))();
            }

            if (file.event === 'change') {
                file.relative.should.eql('index.js');
                done();
            }
        });
    });
});

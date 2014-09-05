/* global describe, it */

var watch = require('..');
var join = require('path').join;
var touch = require('./touch.js');
require('should');

function fixtures(glob) {
    return join(__dirname, 'fixtures', glob);
}

describe('watch', function () {
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
});

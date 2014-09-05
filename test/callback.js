/* global describe, it */

var assert = require('stream-assert');
var watch = require('..');
var join = require('path').join;
var touch = require('./touch.js');
require('should');

function fixtures(glob) {
    return join(__dirname, 'fixtures', glob);
}

describe('callback', function () {
    it('should be called on event', function (done) {
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

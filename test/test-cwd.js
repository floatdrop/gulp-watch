/* global describe, it, afterEach */

var watch = require('..');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var touch = require('./touch.js');
require('should');

function fixtures(glob) {
    return path.join(__dirname, 'fixtures', glob);
}

describe('cwd', function () {
    var w;

    afterEach(function (done) {
        rimraf.sync(fixtures('newDir'));
        w.on('end', done);
        w.close();
    });

    it('should respect opts.cwd', function (done) {
        w = watch('index.js', {cwd: fixtures('')}, function (file) {
            file.relative.should.eql('test/fixtures/index.js');
            done();
        }).on('ready', touch(fixtures('index.js')));
    });
});

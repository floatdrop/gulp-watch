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

describe('base', function () {
    var w;

    afterEach(function (done) {
        rimraf.sync(fixtures('newDir'));
        w.on('end', done);
        w.close();
    });

    it('base property should be equal with ./', function (done) {
        w = watch('./' + path.relative(process.cwd(), fixtures('**/*.js')), function (file) {
            file.relative.should.eql('folder/index.js');
            done();
        }).on('ready', touch(fixtures('folder/index.js')));
    });
});

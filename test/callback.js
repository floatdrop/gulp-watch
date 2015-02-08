/* global describe, it, afterEach */

var watch = require('..');
var join = require('path').join;
var fs = require('fs');
var rimraf = require('rimraf');
var touch = require('./touch.js');
require('should');

function fixtures(glob) {
    return join(__dirname, 'fixtures', glob);
}

describe('callback', function () {
    var w;

    afterEach(function (done) {
        rimraf.sync(fixtures('newDir'));
        w.on('end', done);
        w.close();
    });

    it('should be called on add event', function (done) {
        w = watch(fixtures('*.js'), function (file) {
            file.relative.should.eql('index.js');
            file.event.should.eql('change');
            done();
        }).on('ready', touch(fixtures('index.js')));
    });

    it('should be called on non-glob pattern', function (done) {
        w = watch(fixtures('index.js'), function (file) {
            file.relative.should.eql('index.js');
            file.event.should.eql('change');
            done();
        }).on('ready', touch(fixtures('index.js')));
    });

    it('should be called on add event in new directory', function (done) {
        rimraf.sync(fixtures('newDir'));

        w = watch(fixtures('**/*.ts'), function (file) {
            file.relative.should.eql('newDir/index.ts');
            done();
        }).on('ready', function () {
            fs.mkdirSync(fixtures('newDir'));
            touch(fixtures('newDir/index.ts'))();
        });
    });
});

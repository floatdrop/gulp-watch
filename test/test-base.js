/* global describe, it, beforeEach, afterEach */

var watch = require('..');
var path = require('path');
var rimraf = require('rimraf');
var touch = require('./touch.js');
require('should');

function fixtures(glob) {
    return path.join(__dirname, 'fixtures', glob);
}

describe('base', function () {
    var w, watchPath;

    beforeEach(function () {
        watchPath = './' + path.relative(process.cwd(), fixtures('**/*.js'));
    });

    afterEach(function (done) {
        rimraf.sync(fixtures('newDir'));
        w.on('end', done);
        w.close();
    });

    it('should be determined by glob', function (done) {
        w = watch(watchPath, function (file) {
                file.relative.should.eql('folder/index.js');
                file.base.should.eql(fixtures('/'));
                done();
            }).on('ready', touch(fixtures('folder/index.js')));
    });

    it('should be overridden by option', function (done) {
        var explicitBase = fixtures('folder');
        w = watch(watchPath, {base: explicitBase}, function (file) {
            file.relative.should.eql('index.js');
            file.base.should.eql(explicitBase);
            done();
        }).on('ready', touch(fixtures('folder/index.js')));
    });

});

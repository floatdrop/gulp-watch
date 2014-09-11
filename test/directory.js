/* global beforeEach, describe, it */

var watch = require('..');
var join = require('path').join;
var fs = require('fs');
var rimraf = require('rimraf');
require('should');

function fixtures(glob) {
    return join(__dirname, 'fixtures', glob);
}

describe.skip('directories', function () {
    beforeEach(function () {
        rimraf.sync(fixtures('test'));
    });

    // This test is not responding on directories creation
    it('should emit event on directory creation', function (done) {
        var w = watch(fixtures('**'));
        w.on('ready', function () {
            fs.mkdirSync(fixtures('test'));
        });
        w.on('data', function () {
            w.on('end', done);
            w.close();
        });
    });
});

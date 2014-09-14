/* global beforeEach, describe, it */

var watch = require('..');
var join = require('path').join;
var fs = require('fs');
var rimraf = require('rimraf');
require('should');

function fixtures(glob) {
    return join(__dirname, 'fixtures', glob);
}

describe('directories', function () {
    beforeEach(function () {
        rimraf.sync(fixtures('newDir'));
    });

    it('should emit event on directory creation', function (done) {
        var w = watch(fixtures('**/*.js'));
        w.once('ready', function () {
            fs.mkdirSync(fixtures('newDir'));
        });
        w.on('data', function (file) {
            file.relative.should.eql('test/fixtures/newDir');
            file.should.have.property('contents', null);
            file.event.should.eql('added');
            w.on('end', done);
            w.close();
        });
    });
});

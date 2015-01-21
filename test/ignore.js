/* global describe, it, afterEach */

var watch = require('..');
var join = require('path').join;
var rimraf = require('rimraf');
var touch = require('./touch.js');
var fs = require('fs');
require('should');

function fixtures(glob) {
    return join(__dirname, 'fixtures', glob);
}

describe('ignore', function () {
    var w;

    it('should ignore non-existent folders', function (done) {
        rimraf.sync(fixtures('temp'));

        w = watch([fixtures('**/*.ts'), '!' + fixtures('temp')], function () {
            done('Ignored folder was watched');
        });

        w.on('ready', function () {
            fs.mkdirSync(fixtures('temp'));
            touch(fixtures('temp/index.ts'))();
            rimraf.sync(fixtures('temp'));
            setTimeout(done, 200);
        });
    });
});

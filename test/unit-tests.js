/* global describe, it, afterEach */
'use strict';

delete require.cache[require.resolve('..')];
var watch = require('..'),
    assert = require('assert'),
    stream = require('stream'),
    Stream = stream.Stream;

describe('gulp-watch', function () {
    it('should throw, if we provide invalid callback', function () {
        assert.throws(watch.bind(null, 'string'), /Provided callback is not a function/);
    });

    afterEach(function (done) {
        if (this.watcher) {
            this.watcher.on('end', done);
            this.watcher.close();
            this.watcher = undefined;
        } else {
            done();
        }
    });

    it('should return stream without callback', function () {
        this.watcher = watch();
        assert.ok(this.watcher instanceof Stream, 'Stream was not returned');
    });

    it('should return stream with callback', function () {
        this.watcher = watch(function () { });
        assert.ok(this.watcher instanceof Stream, 'Stream was not returned');
    });
});

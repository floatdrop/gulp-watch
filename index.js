'use strict';

var PluginError = require('gulp-util').PluginError,
    Readable = require('readable-stream').Readable,
    batch = require('gulp-batch'),
    File = require('vinyl'),
    getContents = require('vinyl-fs/lib/src/getContents'),
    getStats = require('vinyl-fs/lib/src/getStats'),
    glob2base = require('glob2base'),
    path2glob = require('path2glob');

module.exports = function (globs, opts, cb) {
    if (!globs) throw new PluginError('gulp-watch', 'glob argument required');

    if (typeof globs === 'string') globs = [ globs ];

    if (!Array.isArray(globs)) {
        throw new PluginError('gulp-watch', 'glob should be String or Array, not ' + (typeof globs));
    }

    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }

    if (!opts) opts = {};

    var outputStream = new Readable({ objectMode: true });
    outputStream._read = function _read() { };

    if (cb) {
        cb = batch(opts, cb);
    }

    var Gaze = require('gaze');
    var gaze = new Gaze(globs);

    gaze.on('all', processEvent);

    function processEvent(event, filepath) {
        outputStream.push(vinylFromEvent(event, filepath));
    }

    function vinylFromEvent(event, filepath) {
        var glob = path2glob(filepath, globs, opts);

        var vinyl = new File({
            cwd: opts.cwd || process.cwd(),
            base: opts.base || glob2base(glob),
            path: filepath
        });

        vinyl.event = event;

        if (event === 'delete') {
            return vinyl;
        }
    }

    outputStream = outputStream
        .pipe(getStats(opts));

    if (opts.read !== false) {
        outputStream = outputStream
            .pipe(getContents(opts));
    }

    if (cb) {
        outputStream.on('data', cb);
    }

    return outputStream;
};

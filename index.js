'use strict';
var util = require('gulp-util'),
    PluginError = require('gulp-util').PluginError,
    chokidar = require('chokidar'),
    Duplex = require('readable-stream').Duplex,
    vinyl = require('vinyl-file'),
    File = require('vinyl'),
    glob2base = require('glob2base'),
    anymatch = require('anymatch'),
    Glob = require('glob').Glob;

module.exports = function (globs, opts, cb) {
    if (!globs) throw new PluginError('gulp-watch', 'glob argument required');

    if (typeof globs === 'string') globs = [globs];

    if (!Array.isArray(globs)) {
        throw new PluginError('gulp-watch', 'glob should be String or Array, not ' + (typeof globs));
    }

    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }

    opts = opts || {};
    cb = cb || function () {};

    opts.events = ['add', 'change', 'unlink'];

    var baseForced = !!opts.base;
    var outputStream = new Duplex({objectMode: true, allowHalfOpen: true});

    outputStream._write = function _write(file, enc, done) {
        cb(file);
        outputStream.push(file);
        done();
    };

    outputStream._read = function _read() { };

    var watcher = chokidar.watch(globs, opts)
        .on('all', processEvent)
        .on('error', outputStream.emit.bind(outputStream, 'error'))
        .on('ready', outputStream.emit.bind(outputStream, 'ready'));

    outputStream.add = watcher.add.bind(watcher);
    outputStream.unwatch = watcher.unwatch.bind(watcher);
    outputStream.close = function () {
        watcher.close();
        outputStream.emit('end');
    };

    function processEvent(event, filepath) {
        var glob = globs[anymatch(globs, filepath, true)];

        opts.path = filepath;

        if (!baseForced) {
            opts.base = glob2base(new Glob(glob, opts));
        }

        // React only on opts.events
        if (opts.events.indexOf(event) === -1) {
            return;
        }

        // Do not stat deleted files
        if (event === 'unlink' || event === 'unlinkDir') {
            return write(event, null, new File(opts));
        }

        vinyl.read(filepath, opts, write.bind(null, event));
    }

    function write(event, err, file) {
        if (err) {
            return outputStream.emit('error', err);
        }

        if (opts.verbose) {
            log(event, file);
        }

        file.event = event;
        outputStream.push(file);
        cb(file);
    }

    function log(event, file) {
        event = event[event.length - 1] === 'e' ? event + 'd' : event + 'ed';

        var msg = [util.colors.magenta(file.relative), 'was', event];

        if (opts.name) {
            msg.unshift(util.colors.cyan(opts.name) + ' saw');
        }

        util.log.apply(util, msg);
    }

    return outputStream;
};

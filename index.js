'use strict';

var util = require('gulp-util'),
    PluginError = require('gulp-util').PluginError,
    through = require('through2'),
    batch = require('gulp-batch'),
    File = require('vinyl'),
    getContents = require('./lib/getContents'),
    getStats = require('./lib/getStats'),
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

    var initialStream = through.obj();

    if (cb) {
        cb = batch(opts, cb);
    }

    var Gaze = require('gaze');
    var gaze = new Gaze(globs, opts);

    gaze.on('all', processEvent);

    function processEvent(event, filepath) {
        var glob = path2glob(filepath, globs, opts);

        if (!glob && opts.verbose !== false) {
            log('not matched by globs', { relative: filepath });
        }

        var vinyl = new File({
            cwd: opts.cwd || process.cwd(),
            base: opts.base || (glob ? glob2base(glob) : undefined),
            path: filepath
        });

        log(event, vinyl);
        vinyl.event = event;

        if (event !== 'deleted') {
            initialStream.write(vinyl);
        } else {
            resultingStream.write(vinyl);
        }
    }

    var getStream = initialStream.pipe(getStats(opts));

    if (opts.read !== false) {
        getStream = getStream.pipe(getContents(opts));
    }

    var resultingStream = getStream.pipe(through.obj());

    if (cb) {
        resultingStream.on('data', cb);
    }

    gaze.on('error', resultingStream.emit.bind(resultingStream, 'error'));
    gaze.on('ready', resultingStream.emit.bind(resultingStream, 'ready'));
    gaze.on('end', resultingStream.emit.bind(resultingStream, 'end'));

    resultingStream.close = function () { gaze.close(); };

    function log(event, file) {
        var msg = [util.colors.magenta(file.relative), 'was', event];
        if (opts.name) { msg.unshift(util.colors.cyan(opts.name) + ' saw'); }
        util.log.apply(util, msg);
    }

    return resultingStream;
};

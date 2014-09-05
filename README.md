# [gulp](https://github.com/gulpjs/gulp)-watch [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]
> Watch, that actually is an endless stream

This is an implementation of [`gulp.watch`](https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpwatchglob—opts-cb) with an endless-stream approach. If `gulp.watch` is working for you, stick with it; otherwise, you can try this `gulp-watch` plugin.

The main reason for `gulp-watch`'s existence is that it can easily (with a little help of [`gulp-plumber`](https://github.com/floatdrop/gulp-plumber) achieve per-file rebuilding on file change:

![Awesome demonstration](https://github.com/floatdrop/gulp-watch/raw/master/img/2014-01-09.gif)

## Usage

### Batching mode

This is close to bundled `gulp.watch`, but with some tweaks. First, files will be grouped by a timeout of `200` milliseconds and passed into the `Stream` inside the callback (keeping `git checkout` commands to rebuild only once). Second, callbacks will __never__ run in parallel (unless you remove `return`), until one `Stream` ends working.

```js
var gulp = require('gulp'),
    watch = require('gulp-watch');

gulp.task('default', function () {
    gulp.src('scss/**/*.scss')
        .pipe(watch(function(files) {
            return files.pipe(sass())
                .pipe(gulp.dest('./dist/'));
        }));
});
```

To watch entire globs of files and directories, you should use `glob` option. In this case `gulp-watch` will pipe files matching glob downstream and begin watching them. Moreover, any newly created files that match `glob` will also be piped downstream and watched for changes.

```js
var gulp = require('gulp'),
    watch = require('gulp-watch');

gulp.task('default', function () {
    watch('scss/**/*.scss', function(files) {
        return files.pipe(sass())
            .pipe(gulp.dest('./dist/'));
    });
});
```

### Continuous stream of events

This is useful when you want blazingly fast rebuilding per file.

__Be aware:__ `end` event never happens in this mode, so plugins dependent on it will never print or do whatever they should do on the `end` task.

```js
// Run before: `npm install gulp gulp-watch gulp-sass`

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass');

gulp.task('default', function () {
    gulp.src('scss/**', { read: false })
        .pipe(watch())
        .pipe(plumber()) // This will keep pipes working after error event
        .pipe(sass())
        .pipe(gulp.dest('./dist/'));
});
```

Same as before — version with `glob` option:

```js
gulp.task('default', function () {
    watch('sass/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('./dist/'));
});
```

### Trigger for mocha

[The problem with `gulp.watch`](https://github.com/gulpjs/gulp/issues/80) is that will run your test suit on every changed file per once. To avoid this [`gulp-batch`](https://github.com/floatdrop/gulp-batch) was written first, but after some time it became clear that `gulp.watch` should be a plugin with event-batching abilities.

```js
var grep = require('gulp-grep-stream');
var mocha = require('gulp-mocha');
var plumber = require('gulp-plumber');

gulp.task('default', function () {
    gulp.src(['lib/**', 'test/**'], { read: false })
        .pipe(watch({ emit: 'all' }, function (files) {
            files
                .pipe(grep('*/test/*.js'))
                .pipe(mocha({ reporter: 'spec' }))
                .on('error', function (err) {
                    if (!/tests? failed/.test(err.stack)) {
                        console.log(err.stack);
                    }
                })
        }));
});
```

### Filtering custom events

When you want to make actions only on specific events, you can use [`gulp-filter`](https://github.com/sindresorhus/gulp-filter) and the `event` attribute, which is added to all files that were `added`, `changed` or `deleted` (per [`gaze`'s documentation](https://github.com/shama/gaze#events)):

```js
var filter = require('gulp-filter');

function isAdded(file) {
    return file.event === 'added';
}

var filterAdded = filter(isAdded);

gulp.task('default', function () {
    watch('**/*.js')
        .pipe(filterAdded)
        .pipe(gulp.dest('newfiles'))
        .pipe(filterAdded.restore())
        .pipe(gulp.dest('oldfiles'));
});
```

**Notice:** `event` property is not added to files that were emitted by `emitOnGlob` and `emit: 'all'` options, only to files that actually caused the event.

## API

### watch([options, callback])

Creates watcher that will spy on files that were piped into it or matched `glob` option in `options`.

This function has three different modes based on `callback` argument:

1. Not defined — you get __stream__ of events that happens with files.
2. `Function` — you get __batched__ mode. See `Callback signature` below.
3. `Array` — on every event that happens with your files, tasks from the `gulp` singleton will be executed (similar to `gulp.watch`, but with batching of events).

### Callback signature: `function(events, [done])`

 * `events` — is `Stream` of incoming events. Events will be grouped by timeout to prevent multiple tasks to be executed repeatedly by commands like `git pull`.
 * `done` — is callback for your function signal to batch once you are done. This allows you to run your callback as soon as the previous `end`.

### Options

If the type of `options` is `String` or `Array`, it will be wrapped into an object: `{ glob: options }`. __Notice:__ you cannot pass `glob` as a `String` or `Array` whilst passing additional options (as this breaks API compatibility).

This object is passed to [`gaze` options](https://github.com/shama/gaze#properties) directly (refer to [`gaze` documentation](https://github.com/shama/gaze)). For __batched__ mode, we are using [`gulp-batch`](https://github.com/floatdrop/gulp-batch#api), so options from there are also available. And of course options for [`gulp.src`](https://github.com/gulpjs/gulp#gulpsrcglobs-options) are used too. If you do not want content from `watch`, then add `read: false` to the `options` object.

#### options.emit
Type: `String`  
Default: `one`

This options defines emit strategy:

 * `one` — emit only changed file
 * `all` — emit all watched files (and folders), when one changes

#### options.passThrough
Type: `Boolean`  
Default: `true`

This options will pass vinyl objects that were piped into `watch` to the next `Stream` in the pipeline.

#### options.glob
Type: `String|Array`  
Default: `undefined`

If you want to detect new files, then you have to use this option. When `gulp-watch` gets files from `gulp.src` it loses the information about pattern of matching; therefore, it cannot detect new files, but with passed patterns in this option, `gulp-watch` will watch all files (that matched pattern and any new files) that were created after `watch` started and will match the `glob` pattern.

#### options.gaze
Type: `Object`  
Default: `undefined`

Contains options that will be passed to `gaze` instance. Full list can be found in [`gaze`'s README](https://github.com/shama/gaze#properties).

#### options.base
Type: `String`  
Default: `undefined`

Use explicit base path for files from `glob`.

#### options.emitOnGlob
Type: `Boolean`  
Default: `true`

If `options.glob` is used, then `gulp-watch`, by default, will emit files when beginning to watch them — much like `gulp.src()`. Otherwise, disable this option.

Example:
```js
// gulp-watch will not emit like gulp.src(...)
watch({glob:'./src/**/*.md', emitOnGlob: false})
    .pipe(plumber())
    .pipe(anotherPlugin(opts))
    .pipe(gulp.dest('./html'))
```

#### options.name
Type: `String`  
Default: `undefined`

Name of the watcher. If it present in options, you will get more readable output:

![Naming watchers](https://github.com/floatdrop/gulp-watch/raw/master/img/naming.png)

#### options.verbose
Type: `Boolean`  
Default: `false`

This options will enable more verbose output (useful for debugging).

#### options.silent
Type: `Boolean`  
Default: `false`

This options will disable all output (useful for tests).

#### options.logRelativePath
Type: `Boolean`
Default: `false`

Logs names of files relative to `process.cwd()`

### Methods

Returned `Stream` from constructor have some useful methods:

 * `close()` — calling `gaze.close` and emitting `end`, after `gaze.close` is done.

### Events

 * `end` — all files are stop being watched.
 * `ready` — just re-emitted event from `gaze`.
 * `error` — when something happened inside callback, you will get notified.

### Properties

 * `gaze` — instance of `gaze` in case you want to call its methods (e.g., `remove`). Be aware that there are __no guarantees__ after you have hacked on `gaze`.

### Returns

`Stream` that handles `gulp.src` piping.

## Tests

To run tests just type `npm test` (after you install dependencies with `npm install`).

# License

MIT (c) 2014 Vsevolod Strukchinsky (floatdrop@gmail.com)

[npm-url]: https://npmjs.org/package/gulp-watch
[npm-image]: http://img.shields.io/npm/v/gulp-watch.svg?style=flat

[travis-url]: https://travis-ci.org/floatdrop/gulp-watch
[travis-image]: http://img.shields.io/travis/floatdrop/gulp-watch.svg?style=flat

[coveralls-url]: https://coveralls.io/r/floatdrop/gulp-watch
[coveralls-image]: http://img.shields.io/coveralls/floatdrop/gulp-watch.svg?style=flat

[depstat-url]: https://david-dm.org/floatdrop/gulp-watch
[depstat-image]: http://img.shields.io/david/floatdrop/gulp-watch.svg?style=flat

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

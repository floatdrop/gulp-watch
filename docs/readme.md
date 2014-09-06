# Recipies

 * [Starting tasks on events](#starting-tasks-on-events)
 * [Filtering custom events](#filtering-custom-events)

### Starting tasks on events

Often you want just to launch some tasks (like `build`) when something happened to watched files.

```js
var gulp = require('gulp');
var watch = require('gulp-watch');

gulp.task('build', function () { console.log('Working!'); });

gulp.task('watch', function () {
    watch('**/*.js', function (files, cb) {
        gulp.start('build', cb);
    });
});
```

> __Why should I use that, instead of shorter `gulp.watch('**/*.js', [build]);` ?__

Since `gulp-watch` is using `gulp-batch` for callback — it will not start another build while one is running. Instead it will buffer files, that triggered callback and run build again with all files. It often happens when you doing `git checkout` or `git reset` or have long `build` task.

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

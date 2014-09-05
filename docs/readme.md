# Recipies

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

var gulp = require('gulp');
var jscs = require('./index.js');

gulp.task('jscs',function () {
    return gulp.src('fixtures/**/*.js')
        .pipe(jscs({
            standard: '',
            rc: '.jscsrc',
            reporters: ['default','beep']
        }));
});

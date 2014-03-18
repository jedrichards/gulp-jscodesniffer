var gutil = require('gulp-util');

module.exports = function (stream) {
    stream.once('end',function () {
        if ( !this.jscs.success ) gutil.beep();
    });
}

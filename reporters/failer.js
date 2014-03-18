var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

module.exports = function (stream) {
    stream.once('end',function () {
        var msg = this.jscs.failCount+' out of '+this.jscs.results.length+' files failed';
        if ( !this.jscs.success ) this.emit('error',new PluginError('gulp-jscodesniffer',msg,{showStack:false}));
    });
}

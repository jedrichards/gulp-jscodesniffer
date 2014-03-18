const PLUGIN_NAME = 'gulp-jscodesniffer';

var Sniffer = require('jscodesniffer/lib/Sniffer');
var Dictionary = require('jscodesniffer/lib/Dictionary');
var path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var through = require('through2');

var dictionary = new Dictionary();
var sniffer = new Sniffer();
var noop = function () {};

module.exports = plugin;

function plugin (options) {

    options = options || {};

    var rc = options.rc ? loadRc(options.rc) : {};

    var snifferOptions = {};
    snifferOptions.standard = options.standard;

    var reporters = options.reporters && options.reporters.length > 0 ? options.reporters : ['default'];
    reporters = processReporters(reporters);

    var stream = through.obj(function (file,enc,cb) {
        if ( file.isBuffer() ) {
            var src = file.contents.toString();
            var messages = sniffer.getTestResults(src,snifferOptions,rc).getMessages();
            messages = dictionary.translateBulk(messages,true);
            var result = {
                fullPath: file.path,
                fileName: path.basename(file.path),
                dir: path.dirname(file.path).split('/').pop(),
                pass: messages.length === 0,
                messages: messages
            }
            file.jscs = {result:result};

        }

        this.jscs.results = this.jscs.results || [];
        this.jscs.results.push(result);
        this.jscs.failCount = typeof this.jscs.failCount == 'number' ? this.jscs.failCount : 0;
        if ( !result.pass ) this.jscs.failCount++;
        this.jscs.success = typeof this.jscs.success == 'undefined' ? true : this.jscs.success;
        if ( !result.pass ) this.jscs.success = false;
        this.push(file);
        cb();
    });

    applyReporters(reporters,stream);

    stream.jscs = stream.jscs || {};
    stream.jscs.log = console.log.bind(console);

    return stream;
}

function loadRc (filePath) {
    filePath = path.resolve(filePath);
    return JSON.parse(fs.readFileSync(filePath,'utf8'));
}

function processReporters (reporters) {
    reporters.forEach(function (reporter,index) {
        switch ( typeof reporter ) {
        case 'string':
            reporters[index] = require('./reporters/'+reporter)
            break;
        case 'function':
            break;
        default:
            reporters[index] = noop;
            break;
        }
    });
    return reporters;
}

function applyReporters (reporters,stream) {
    reporters.forEach(function (reporter) {
        reporter(stream);
    });
}

var jscs = require('../');
var should = require('should');
var gutil = require('gulp-util');
var path = require('path');
var fs = require('fs');

require('mocha');

var passingFile1;
var passingFile2;
var failingFile1;
var failingFile2;
var logs = [];
var stream;

function logSpy (item) {
    logs.push(item);
}

function resetFiles () {
    passingFile1 = fakeFile('fixtures/passing/QuoteConventions.js');
    passingFile2 = fakeFile('fixtures/passing/VariableNamingConventions.js');
    failingFile1 = fakeFile('fixtures/failing/QuoteConventions.js');
    failingFile2 = fakeFile('fixtures/failing/VariableNamingConventions.js');
}

function fakeFile (path) {
    var file = new gutil.File({path:path});
    file.contents = fs.readFileSync(file.path);
    return file;
}

describe('gulp-jscs',function () {

    describe('failing files',function () {

        beforeEach(function () {
            logs = [];
            resetFiles();
            stream = jscs({rc:'.jscsrc'});
            stream.jscs.log = logSpy;
        });

        it('should generate output',function (done) {
            stream.once('end',function () {
                logs.length.should.be.above(0);
                done();
            });
            stream.write(failingFile1);
            stream.write(failingFile2);
            stream.end();
        });

        it('should set an overall failure flag',function (done) {
            stream.once('end',function () {
                stream.jscs.success.should.be.false;
                done();
            });
            stream.write(failingFile1);
            stream.write(failingFile2);
            stream.end();
        });

        it('should create an aggregated set of results',function (done) {
            stream.once('end',function () {
                stream.jscs.results.should.be.an.Array.with.lengthOf(2);
                done();
            });
            stream.write(failingFile1);
            stream.write(failingFile2);
            stream.end();
        });

        it('should set a result object on each file',function (done) {
            var count = 0;
            stream.on('data',function (file) {
                if ( file.jscs ) count++;
            });
            stream.once('end',function () {
                count.should.equal(2);
                done();
            });
            stream.write(failingFile1);
            stream.write(failingFile2);
            stream.end();
        });
    });

    describe('passing files',function () {

        beforeEach(function () {
            logs = [];
            resetFiles();
            stream = jscs({rc:'.jscsrc'});
            stream.jscs.log = logSpy;
        });

        it('should generate no output',function (done) {
            stream.once('end',function () {
                logs.should.have.lengthOf(0);
                done();
            });
            stream.write(passingFile1);
            stream.write(passingFile2);
            stream.end();
        });

        it('should set an overall success flag',function (done) {
            stream.once('end',function () {
                stream.jscs.success.should.be.true;
                done();
            });
            stream.write(passingFile1);
            stream.write(passingFile2);
            stream.end();
        });

        it('should create an aggregated set of results',function (done) {
            stream.once('end',function () {
                stream.jscs.results.should.be.an.Array.with.lengthOf(2);
                done();
            });
            stream.write(passingFile1);
            stream.write(passingFile2);
            stream.end();
        });

        it('should set a result object on each file',function (done) {
            var count = 0;
            stream.on('data',function (file) {
                if ( file.jscs ) count++;
            });
            stream.once('end',function () {
                count.should.equal(2);
                done();
            });
            stream.write(passingFile1);
            stream.write(passingFile2);
            stream.end();
        });
    });
});

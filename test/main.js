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
    passingFile1 = new gutil.File({
        path: 'fixtures/passing/QuoteConventions.js'
    });
    passingFile1.contents = fs.readFileSync(passingFile1.path);
    passingFile2 = new gutil.File({
        path: 'fixtures/passing/VariableNamingConventions.js'
    });
    passingFile2.contents = fs.readFileSync(passingFile2.path);

    failingFile1 = new gutil.File({
        path: 'fixtures/failing/QuoteConventions.js'
    });
    failingFile1.contents = fs.readFileSync(failingFile1.path);
    failingFile2 = new gutil.File({
        path: 'fixtures/failing/VariableNamingConventions.js'
    });
    failingFile2.contents = fs.readFileSync(failingFile2.path);
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
